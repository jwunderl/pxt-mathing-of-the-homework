type digit = "DIGIT";
type operator = "OP";

interface ProjectileType {
    variant: digit | operator,
    data: string;
}

/**
 * Allowed operators
 */
const operators = ["<", "=", ">", "+", "-"]

namespace selection {
    /** The current selection by the user */
    let userSelection = 0;

    /** How long to wait before creating another projectile (ms) */
    let timeBetweenCreation = 350;

    export function createNumberProjectile() {
        createTaggedProjectile({
            variant: "DIGIT",
            data: currentNumber()
        });
    }

    export function createOperatorProjectile() {
        createTaggedProjectile({
            variant: "OP",
            data: currentOperator()
        });
    }

    function currentNumber(): string {
        return "" + normalizeSelection(10);
    }

    function currentOperator(): string {
        return operators[normalizeSelection(operators.length)];
    }

    function createTaggedProjectile(tag: ProjectileType, font?: image.Font) {
        debounce(() => {
            font = font || image.font8;

            const outputImage = image.create(font.charWidth, font.charHeight);
            outputImage.printCenter(tag.data, 0, Math.randomRange(0x2, 0x6), font);

            const output = sprites.createProjectileFromSprite(outputImage, player, 50, 0);
            output.data = tag;
        });
    }

    /** Time (in ms) when a projectile was last created */
    let lastCreation = 0;

    // roughly the behavior of a true 'debounce' function for createTaggedProject, but based off a global
    // timer instead for lack of an .apply method (and not hacking it with a options bag params)
    function debounce(event: () => void) {
        const currTime = game.runtime();
        if (lastCreation + timeBetweenCreation < currTime) {
            lastCreation = currTime;
            event();
        }
    }

    function normalizeSelection(exclude: number) {
        const modded = userSelection % exclude;
        if (userSelection < 0) {
            return (exclude + modded) % exclude;
        } else {
            return modded;
        }
    }

    util.setRepeatBehavior(controller.left, 350, () => --userSelection);
    util.setRepeatBehavior(controller.right, 350, () => ++userSelection);
}

const player = sprites.create(img`
    . . . . . . . . . . b 5 b . . .
    . . . . . . . . . b 5 b . . . .
    . . . . . . b b b b b b . . . .
    . . . . . b b 5 5 5 5 5 b . . .
    . . . . b b 5 d 1 f 5 5 d f . .
    . . . . b 5 5 1 f f 5 d 4 c . .
    . . . . b 5 5 d f b d d 4 4 . .
    . b b b d 5 5 5 5 5 4 4 4 4 4 b
    b d d d b b d 5 5 4 4 4 4 4 b .
    b b d 5 5 5 b 5 5 5 5 5 5 b . .
    c d c 5 5 5 5 d 5 5 5 5 5 5 b .
    c b d c d 5 5 b 5 5 5 5 5 5 b .
    . c d d c c b d 5 5 5 5 5 d b .
    . . c b d d d d d 5 5 5 b b . .
    . . . c c c c c c c c b b . . .
    . . . . . . . . . . . . . . . .
`)

player.x = 20;
controller.moveSprite(player, 0, 100);

util.setRepeatBehavior(controller.A, 50, selection.createNumberProjectile);
util.setRepeatBehavior(controller.B, 50, selection.createOperatorProjectile);

namespace util {
    export function setRepeatBehavior(button: controller.Button, interval: number, h: () => void) {
        button.repeatDelay = 0;
        button.repeatInterval = interval;
        button.onEvent(ControllerButtonEvent.Repeated, h);
    }
}