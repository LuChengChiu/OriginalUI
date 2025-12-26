# Testing Infrastructure

## Directory Structure

```
tests/
├── unit/                   # Unit tests (vitest/jest)
├── integration/            # Integration tests  
├── manual/                 # Manual testing files
├── documentation/          # Testing guides and docs
├── legacy/                 # Legacy test files (to be migrated)
└── README.md              # This file
```

## Running Tests

```bash
# Unit tests
npm run test

# Manual tests
# Open test-*.html files in browser with extension loaded
```

## Test Categories

### Unit Tests (`tests/unit/`)
- Individual module testing
- Component testing
- Utility function testing

### Integration Tests (`tests/integration/`)
- Module interaction testing
- End-to-end workflow testing

### Manual Tests (`tests/manual/`)
- Browser-based testing files
- Extension functionality validation
- Performance testing

### Documentation (`tests/documentation/`)
- Testing guides
- Test procedures
- Known issues and limitations

## Guidelines

1. **Keep tests** - Tests are assets, not temporary files
2. **Organize by purpose** - Unit, integration, manual, docs
3. **Clean naming** - Descriptive test file names
4. **Remove only temporary refactoring tests** - Not functional tests