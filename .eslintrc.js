module.exports = {
    'extends': 'eslint:recommended',
    'env': {
        'node': true,
        'jasmine': true,
        'es6': true,
    },
    'rules': {
        'no-console': 0,
        'comma-dangle': [1, 'always-multiline'],
        'brace-style': [2, '1tbs'],
        'func-style': 0,
        'guard-for-in': 2,
        'no-floating-decimal': 2,
        'no-nested-ternary': 2,
        'no-undefined': 2,
        'radix': 2,
        'space-after-keywords': [2, 'always'],
        'no-multi-spaces': 0,
        'wrap-iife': 2,
        'quotes': [1, 'single'],
        'strict': [1, 'global'],
        'new-cap': 2,
        'camelcase': [2, {properties: 'never'}],
        'valid-jsdoc': [2, {
            'requireReturn': false,
            'matchDescription': '^[A-Z][A-Za-z0-9\\s.!,]*[.]$',
        }],
        'require-jsdoc': [2, {
            'require': {
                'FunctionDeclaration': true,
                'MethodDefinition': true,
                'ClassDeclaration': true,
            },
        }],
    },
    'plugins': [],
};
