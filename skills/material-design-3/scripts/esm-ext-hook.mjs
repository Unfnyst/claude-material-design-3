/**
 * Node ESM resolve hook.
 *
 * @material/material-color-utilities v0.4.0 publishes a handful of internal
 * imports without a file extension (e.g. `from '../dynamiccolor/dynamic_color'`),
 * which Node's ESM resolver rejects. This hook retries any extensionless
 * relative specifier with `.js` appended.
 *
 * It patches resolution in-memory for this process only. Nothing on disk and
 * nothing in node_modules is modified.
 */
export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (err) {
    if (specifier.startsWith('.') && !/\.[cm]?jsx?$/.test(specifier)) {
      return await nextResolve(specifier + '.js', context);
    }
    throw err;
  }
}
