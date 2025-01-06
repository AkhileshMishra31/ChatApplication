module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
      'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci']],
      'subject-case': [0, 'never'], 
      'subject-empty': [2, 'never'], 
      'type-empty': [2, 'never'], 
      'subject-min-length': [2, 'always', 3], 
    }
  };
  