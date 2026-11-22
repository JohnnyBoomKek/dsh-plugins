window.__ModuleLoader__.load({
  id: '@local/strawberry-latte',
  factory() {
    const palette = {
      'alias-bg-base': ['#FFF7F2', '#241B23'],
      'alias-bg-layer-1': ['#FFFBF8', '#30242E'],
      'specific-sidebar-fill': ['#F8E9EB', '#2D222B'],
      'specific-bubble': ['#F4C2D2', '#563448'],
      'specific-bubble-highlight': ['#ECAAC2', '#71445D'],
      'alias-label-primary': ['#342530', '#F7EAF0'],
      'alias-label-secondary': ['#65505C', '#D3BAC8'],
      'alias-state-business-primary': ['#9E3F66', '#A3446D'],
      'alias-state-business-tertiary': ['#F8DBE6', '#573347'],
      'focus-ring-color': ['#9E3F66', '#F2A9C7'],
    };
    const tokens = Object.fromEntries(Object.entries(palette).map(
      ([key, [light, dark]]) => [`--dsw-${key}`, { light, dark }],
    ));
    return {
      inject: ['theme'],
      apply(ctx) {
        ctx.effect(() => ctx.theme.overrideTokens('@local/strawberry-latte', tokens), 'strawberry-latte: palette');
      },
    };
  },
});
