export const getComplexityLevel = (complexity: number) => {
    if (complexity < 10) return { label: 'Simple', color: 'green', icon: 'i-heroicons-check-circle' };
    if (complexity < 20) return { label: 'Moderate', color: 'yellow', icon: 'i-heroicons-exclamation-circle' };
    if (complexity < 40) return { label: 'Complex', color: 'orange', icon: 'i-heroicons-exclamation-triangle' };
    return { label: 'High', color: 'red', icon: 'i-heroicons-fire' };
};

export const getComplexityDescription = (complexity: number) => {
    return `Estimated complexity score of ${complexity}. Lower is generally better for maintainability.`
}