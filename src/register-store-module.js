export default function registerStoreModule({ module, name, store }) {
  // eslint-disable-next-line no-underscore-dangle
  const moduleIsRegistered = store._modules.root._children[name] !== undefined;
  const preserveState = store.state[name] !== undefined;

  if (!moduleIsRegistered) store.registerModule(name, module, { preserveState });
}
