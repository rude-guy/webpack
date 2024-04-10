function treeShakingPlugin() {
  return {
    visitor: {
      'VariableDeclarator|FunctionDeclaration'(path) {
        const binding = path.scope.getBinding(path.node.id.name);
        if (!binding || binding.referenced) return;
        path.remove();
      },
    },
  };
}

module.exports = treeShakingPlugin;
