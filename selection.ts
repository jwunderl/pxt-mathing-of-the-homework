
namespace selection {
    /** The current selection by the user */
    let userSelection = 0;

    /** How long to wait before creating another projectile (ms) */
    let timeBetweenCreation = 350;

    const throttle = util.generateThrottler(() => timeBetweenCreation);

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

    export function currentNumber(): string {
        return "" + normalizeSelection(10);
    }

    export function currentOperator(): string {
        return operators[normalizeSelection(operators.length)];
    }

    function createTaggedProjectile(tag: ProjectileType, font?: image.Font) {
        throttle(() => {
            font = font || image.font8;

            const outputImage = image.create(font.charWidth, font.charHeight);
            outputImage.printCenter(tag.data, 0, Math.randomRange(0x2, 0x6), font);

            const output = sprites.createProjectileFromSprite(outputImage, player, 50, 0);
            output.data = tag;
        });
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