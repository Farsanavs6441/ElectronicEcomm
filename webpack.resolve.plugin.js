class ResolvePlugin {
  constructor() {
    this.name = 'ResolvePlugin';
  }

  apply(resolver) {
    const target = resolver.ensureHook('resolved');

    resolver
      .getHook('described-resolve')
      .tapAsync('ResolvePlugin', (request, resolveContext, callback) => {
        const req = request.request;

        // Handle React Navigation module resolution issues
        if (req && req.includes('@react-navigation')) {
          // Add .js extension if missing
          if (
            !req.endsWith('.js') &&
            !req.endsWith('.ts') &&
            !req.endsWith('.tsx')
          ) {
            const newRequest = {
              ...request,
              request: req + '.js',
            };
            return resolver.doResolve(
              target,
              newRequest,
              null,
              resolveContext,
              callback,
            );
          }
        }

        // Handle relative imports in React Navigation
        const relativeImports = [
          './useBackButton',
          './useDocumentTitle',
          './useLinking',
          '../MaskedView',
          '../GestureHandler',
        ];

        if (relativeImports.includes(req)) {
          const newRequest = {
            ...request,
            request: req + '.js',
          };
          return resolver.doResolve(
            target,
            newRequest,
            null,
            resolveContext,
            callback,
          );
        }

        callback();
      });
  }
}

module.exports = ResolvePlugin;
