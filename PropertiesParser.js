export default class PropertiesParser {
  static parse(content) {
    const lines = content.split('\n');
    const object = {};
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const isCommentLine = line.trim().startsWith('#'); // ignore comments
      const isAssignmentLine = line.includes('='); // ignore comments
      const isMultilineOpening = line.trimEnd().endsWith('\\') && line.includes('=');
      const isMultilineTrailing = line.trimEnd().endsWith('\\') && line.trim().length < line.length; // ignore trailing multilines
      if (!isCommentLine && !isMultilineTrailing && isAssignmentLine) {
        const tuple = line.split('=');
        const key = tuple[0];
        let value = tuple[1];
        const steps = key.split('.');
        const keymap = {};
        let nextmap = keymap;
        for (let j = 0; j < steps.length; j++) {
          if (j + 1 === steps.length) {
            if (isMultilineOpening) {
              value = value?.trimEnd().replace('\\', '');
              let k = 1;
              while (i + k < lines.length && lines[i + k].trimEnd().endsWith('\\') && !lines[i + k].includes('=')) {
                value += lines[i + k].trim().trimEnd().replace('\\', '');
                k += 1;
              }
            }
            nextmap[steps[j]] = value;
          } else {
            nextmap[steps[j]] = {};
            nextmap = nextmap[steps[j]];
          }
          Object.assign(object, keymap);
        }
      }
    }
    return object;
  }
}
