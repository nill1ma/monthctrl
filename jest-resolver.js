'use strict';
const path = require('path');

module.exports = (modulePath, options) => {
  if (modulePath === 'react-native') {
    console.error('RESOLVER HIT: react-native -> mock');
    return path.resolve(__dirname, '__mocks__/react-native.js');
  }
  const originalPackageFilter = options.packageFilter;
  return options.defaultResolver(modulePath, {
    ...options,
    packageFilter: pkg => {
      const filteredPkg = originalPackageFilter ? originalPackageFilter(pkg) : pkg;
      if (filteredPkg.name === 'react-native') { delete filteredPkg.exports; }
      return filteredPkg;
    },
  });
};