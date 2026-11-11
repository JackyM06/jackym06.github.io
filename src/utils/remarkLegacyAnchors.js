/** Reuse Hexo heading IDs so existing fragment links keep working. */
export function remarkLegacyAnchors() {
  return tree => {
    function visit(parent) {
      if (!parent.children) return;
      for (let i = 0; i < parent.children.length; i++) {
        const node = parent.children[i];
        const next = parent.children[i + 1];
        const raw = node.type === "html" ? node.value : node.type === "paragraph" && node.children.every(child => child.type === "html") ? node.children.map(child => child.value).join("") : "";
        const id = raw && raw.trim().match(/^<a id="([^"]+)"><\/a>$/)?.[1];
        if (id && next?.type === "heading") {
          next.data ??= {};
          next.data.hProperties ??= {};
          next.data.hProperties.id = id;
          parent.children.splice(i, 1);
          i--;
        } else visit(node);
      }
    }
    visit(tree);
  };
}
