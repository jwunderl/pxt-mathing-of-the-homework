namespace util {
    export function setRepeatBehavior(button: controller.Button, interval: number, h: () => void) {
        button.repeatDelay = 0;
        button.repeatInterval = interval;
        button.onEvent(ControllerButtonEvent.Repeated, h);
    }

    export function generateDebouncer(timeoutGenerator: () => number): (event: () => void) => void {
        let lastCall = 0;
        return (event: () => void) => {
            const currTime = game.runtime();
            const timeout = timeoutGenerator();

            if (lastCall + timeout < currTime) {
                event();
            }
            lastCall = currTime;
        }
    }

    export function generateThrottler(timeoutGenerator: () => number): (event: () => void) => void {
        let lastCall = 0;

        return (event: () => void) => {
            const currTime = game.runtime();
            const timeout = timeoutGenerator();

            if (lastCall + timeout < currTime) {
                lastCall = currTime;
                event();
            }
        }
    }
}