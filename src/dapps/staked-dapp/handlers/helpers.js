const calculateEth2Rewards = ({
  slotTimeInSec = 12,
  slotsInEpoch = 32,
  baseRewardFactor = 64,
  totalAtStake = 1_000_000,
  baseRewardsPerEpoch = 4,
  baseRewardsPropotionalValidators = 3,
  averageNetworkPctOnline = 0.95,
  oneSlotLatePenalty = 0.0156,
  vaildatorUptime = 0.99,
  validatorDeposit = 32
}) => {
  // Calculate number of epochs per year
  const avgSecInYear = 31556908.8; // 60 * 60 * 24 * 365.242
  const epochPerYear = avgSecInYear / (slotTimeInSec * slotsInEpoch);

  // Calculate base reward for full validator (in gwei)
  const baseGweiRewardFullValidator =
    (32 * 10e8 * baseRewardFactor) /
    (totalAtStake * 10e8) ** 0.5 /
    baseRewardsPerEpoch;

  // Calculate offline per-validator penalty per epoch (in gwei)
  const offlineEpochGweiPentalty = baseGweiRewardFullValidator * 4;

  // Calculate online per-validator reward per epoch (in gwei)
  const fullUptimeValidatorRewards =
    baseGweiRewardFullValidator *
    baseRewardsPropotionalValidators *
    averageNetworkPctOnline;
  const oneEighthReward =
    0.125 * baseGweiRewardFullValidator * averageNetworkPctOnline;
  const rewardAdjModifier =
    averageNetworkPctOnline +
    averageNetworkPctOnline *
      (1 - averageNetworkPctOnline) *
      (1 - oneSlotLatePenalty) +
    averageNetworkPctOnline *
      (1 - averageNetworkPctOnline) ** 2 *
      (1 - 2 * oneSlotLatePenalty);
  const sevenEighthsReward =
    0.875 * baseGweiRewardFullValidator * rewardAdjModifier;
  const onlineEpochGweiReward =
    fullUptimeValidatorRewards + oneEighthReward + sevenEighthsReward;

  // Calculate net yearly staking reward (in gwei)
  const reward = onlineEpochGweiReward * vaildatorUptime;
  const penalty = offlineEpochGweiPentalty * (1 - vaildatorUptime);
  const netRewardPerYear = epochPerYear * (reward - penalty);

  // Return net yearly staking reward percentage
  return netRewardPerYear / 10e8 / validatorDeposit;
};

export default calculateEth2Rewards;
