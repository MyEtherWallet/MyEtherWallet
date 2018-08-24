'use strict'

const SecalotEth = function (comm, pinCode) {
  this.comm = comm
  if (typeof pinCode !== 'undefined') this.pinCode = pinCode
}

SecalotEth.splitPath = function (path) {
  let result = []
  let components = path.split('/')

  components.forEach((element, index) => {
    let number = parseInt(element, 10)
    if (isNaN(number)) {
      return
    }
    if (element.length > 1 && element[element.length - 1] === "'") {
      number += 0x80000000
    }
    result.push(number)
  })
  return result
}

SecalotEth.getErrorMessage = function (sw, operation) {
  let errorMessage
  if (sw === 0x6d00) {
    errorMessage = 'Ethereum wallet on your Secalot is not initialized.'
  } else if (sw === 0x6982) {
    if (operation === 'getPublicKey') {
      errorMessage =
        'Invalid PIN-code. Be careful, after entering a wrong PIN-code three times in a row, your Secalot Ethereum wallet would be permanently wiped.'
    } else {
      errorMessage = 'PIN-code not verified.'
    }
  } else if (sw === 0x6700) {
    errorMessage = 'Invalid PIN-code length.'
  } else if (sw === 0x6985) {
    errorMessage = 'Operation timed out.'
  } else {
    errorMessage = 'An error has occurred. SW = ' + sw.toString(16) + '.'
  }

  return errorMessage
}

SecalotEth.prototype.getAddress = function (path, callback) {
  let splitPath = SecalotEth.splitPath(path)
  let apdus = []
  let buffer
  const self = this
  const localCallback = function (response, error) {
    if (typeof error !== 'undefined') {
      callback(undefined, error)
    } else {
      const result = {}
      response = Buffer.from(response, 'hex')
      let sw = response.readUInt16BE(response.length - 2)
      if (sw !== 0x9000) {
        callback(undefined, SecalotEth.getErrorMessage(sw, 'getPublicKey'))
        return
      }
      if (apdus.length === 0) {
        result['publicKey'] = response.slice(0, 65).toString('hex')
        result['chainCode'] = response.slice(65, 97).toString('hex')
        callback(result)
      } else {
        self.comm.exchange(apdus.shift(), localCallback)
      }
    }
  }

  if (typeof this.pinCode !== 'undefined') {
    let pin = Buffer.from(this.pinCode, 'utf8')
    buffer = Buffer.alloc(5 + pin.length)
    buffer[0] = 0x80
    buffer[1] = 0x22
    buffer[2] = 0x00
    buffer[3] = 0x00
    buffer[4] = pin.length

    pin.copy(buffer, 5, 0, pin.length)
    apdus.push(buffer.toString('hex'))
  }

  buffer = Buffer.alloc(5 + 1 + splitPath.length * 4)
  buffer[0] = 0x80
  buffer[1] = 0x40
  buffer[2] = 0x00
  buffer[3] = 0x00
  buffer[4] = 1 + splitPath.length * 4
  buffer[5] = splitPath.length
  splitPath.forEach((element, idx) => {
    buffer.writeUInt32BE(element, 6 + 4 * idx)
  })

  apdus.push(buffer.toString('hex'))
  self.comm.exchange(apdus.shift(), localCallback)
}

SecalotEth.prototype.signTransaction = function (path, eTx, callback) {
  let splitPath = SecalotEth.splitPath(path)
  let offset = 0
  let rawData
  let apdus = []
  const self = this
  const localCallback = function (response, error) {
    if (typeof error !== 'undefined') {
      callback(undefined, error)
    } else {
      response = Buffer.from(response, 'hex')
      let sw = response.readUInt16BE(response.length - 2)

      if (sw !== 0x9000) {
        callback(undefined, SecalotEth.getErrorMessage(sw, 'signTransaction'))
        return
      }

      if (apdus.length === 0) {
        let result = {}
        let v = response[0] + 27

        if (eTx._chainId > 0) {
          v += eTx._chainId * 2 + 8
        }

        result['v'] = Buffer.from([v]).toString('hex')
        result['r'] = response.slice(1, 1 + 32).toString('hex')
        result['s'] = response.slice(1 + 32, 1 + 32 + 32).toString('hex')
        callback(result)
      } else {
        self.comm.exchange(apdus.shift(), localCallback)
      }
    }
  }

  let savedRaw = eTx.raw.slice()
  eTx.v = eTx._chainId
  eTx.r = 0
  eTx.s = 0
  let dataToHash = eTx.serialize()
  eTx.raw = savedRaw

  rawData = Buffer.from(dataToHash, 'hex')

  while (offset !== rawData.length) {
    let maxChunkSize = 64
    let chunkSize =
      offset + maxChunkSize > rawData.length
        ? rawData.length - offset
        : maxChunkSize
    let buffer = Buffer.from(5, chunkSize)

    buffer[0] = 0x80
    buffer[1] = 0xf2
    buffer[2] = offset === 0 ? 0x00 : 0x01
    buffer[3] = 0x00
    buffer[4] = chunkSize

    rawData.copy(buffer, 5, offset, offset + chunkSize)
    apdus.push(buffer.toString('hex'))
    offset += chunkSize
  }

  let buffer = Buffer.alloc(5 + 1 + splitPath.length * 4)

  buffer[0] = 0x80
  buffer[1] = 0xf2
  buffer[2] = 0x02
  buffer[3] = 0x00
  buffer[4] = 1 + splitPath.length * 4
  buffer[5] = splitPath.length

  splitPath.forEach((element, index) => {
    buffer.writeUInt32BE(element, 6 + 4 * index)
  })

  apdus.push(buffer.toStirng('hex'))
  self.comm.exchange(apdus.shift(), localCallback)
}

SecalotEth.prototype.signMessage = function (path, message, callback) {
  let splitPath = SecalotEth.splitPath(path)
  let offset = 0
  let rawData
  let apdus = []
  const self = this
  const localCallback = function (response, error) {
    if (typeof error !== 'undefined') {
      callback(undefined, error)
    } else {
      response = Buffer.from(response, 'hex')
      let sw = response.readUInt16BE(response.length - 2)
      if (sw !== 0x9000) {
        callback(undefined, SecalotEth.getErrorMessage(sw, 'signMessage'))
        return
      }
      if (apdus.length === 0) {
        let result = {}
        let v = response[0] + 27
        result['v'] = Buffer.from([v]).toString('hex')
        result['r'] = response.slice(1, 1 + 32).toString('hex')
        result['s'] = response.slice(1 + 32, 1 + 32 + 32).toString('hex')
        callback(result)
      } else {
        self.comm.exchange(apdus.shift(), localCallback)
      }
    }
  }

  message =
    '\x19Ethereum Signed Message:\n' + message.length.toString() + message
  rawData = Buffer.from(Buffer.from(message.toString('hex'), 'hex'))

  while (offset !== rawData.length) {
    let maxChunkSize = 64
    let chunkSize =
      offset + maxChunkSize > rawData.length
        ? rawData.length - offset
        : maxChunkSize
    let buffer = Buffer.alloc(5 + chunkSize)
    buffer[0] = 0x80
    buffer[1] = 0xf2
    buffer[2] = offset === 0 ? 0x00 : 0x01
    buffer[3] = offset === 0 ? 0x01 : 0x00
    buffer[4] = chunkSize

    rawData.copy(buffer, 5, offset, offset + chunkSize)

    apdus.push(buffer.toString('hex'))
    offset += chunkSize
  }

  let buffer = Buffer.alloc(5 + 1 + splitPath.length * 4)
  buffer[0] = 0x80
  buffer[1] = 0xf2
  buffer[2] = 0x02
  buffer[3] = 0x00
  buffer[4] = 1 + splitPath.length * 4
  buffer[5] = splitPath.length

  splitPath.forEach((element, idx) => {
    buffer.writeUInt32BE(element, 6 + 4 * idx)
  })

  apdus.push(buffer.toString('hex'))
  self.comm.exchange(apdus.shift(), localCallback)
}

export default SecalotEth
