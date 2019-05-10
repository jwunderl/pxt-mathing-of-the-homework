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
