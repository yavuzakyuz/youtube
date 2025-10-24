document.body.innerHTML = `
    <div id="dark-light-switch-icon-sun" style="display:"></div>
    <div id="dark-light-switch-icon-moon" style="display:"></div>
`;
global.extension = {
    skeleton: {
        header: {
            sectionEnd: {
                darkLightSwitch: {
                    svgSun: { on: {} },
                    svgMoon: { on: {} },
                    on: {}
                }
            }
        }
    }
};
let onChangedHandler;
const storageData = new Map();
global.satus = {
    storage: {
        get: jest.fn((key) => storageData.get(key)),
        set: jest.fn((key, value) => { storageData.set(key, value); }),
        onchanged: jest.fn((handler) => { onChangedHandler = handler; })
    }
};
require('../../menu/skeleton-parts/dark-light-switch.js');
describe('dark-light-switch onchanged behavior (drives desired change)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        storageData.clear();
        storageData.set('theme', 'black');
        storageData.set('lastDarkTheme', 'black');
        storageData.set('lastLightTheme', 'default');
        document.getElementById('dark-light-switch-icon-sun').style.display = '';
        document.getElementById('dark-light-switch-icon-moon').style.display = '';
    });

    test('ignores non-theme changes', () => {
        onChangedHandler('someOtherKey', 'value');
        expect(satus.storage.set).not.toHaveBeenCalled();
        expect(document.getElementById('dark-light-switch-icon-sun').style.display).toBe('');
        expect(document.getElementById('dark-light-switch-icon-moon').style.display).toBe('');
    });

    test('updates lastDarkTheme only when value changes (no redundant writes)', () => {
        onChangedHandler('theme', 'black');
        expect(satus.storage.set).not.toHaveBeenCalledWith('lastDarkTheme', 'black');
        storageData.set('lastDarkTheme', 'dark');
        onChangedHandler('theme', 'black');
        expect(satus.storage.set).toHaveBeenCalledWith('lastDarkTheme', 'black');
    });

    test('does not re-trigger on its own bookkeeping keys', () => {
        onChangedHandler('lastDarkTheme', 'black');
        expect(satus.storage.set).not.toHaveBeenCalled();
    });
});
