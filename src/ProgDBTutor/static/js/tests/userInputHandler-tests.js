import { UserInputHandler } from '../userInputHandler.js';

describe("UserInputHandler Tests", () => {
    let userInputHandler;
    let mockClass;

    beforeEach(() => {
        mockClass = {
            handleClick: jasmine.createSpy('handleClick'),
            handleMouseMove: jasmine.createSpy('handleMouseMove'),
        };
        userInputHandler = new UserInputHandler([mockClass]);
    });

    it('should correctly set up instance with provided classes', () => {
        expect(userInputHandler.classes).toEqual([mockClass]);
    });

    it('should handle keydown events', () => {
        const mockEvent = { key: 'a' };
        spyOn(userInputHandler, 'handleKeyDown');
        document.dispatchEvent(new KeyboardEvent('keydown', mockEvent));

        expect(userInputHandler.handleKeyDown).toHaveBeenCalledWith(jasmine.objectContaining(mockEvent));
    });

    it('should call handleClick on class when handleClickInput is called and class implements handleClick', () => {
        userInputHandler.handleClickInput(100, 100);
        expect(mockClass.handleClick).toHaveBeenCalledWith(100, 100);
    });

    it('should call handleMouseMove on class when handleMouseMove is called and class implements handleMouseMove', () => {
        userInputHandler.handleMouseMove(150, 150);
        expect(mockClass.handleMouseMove).toHaveBeenCalledWith(150, 150);
    });

    // Additional tests can be added here to cover more scenarios and methods.
});
