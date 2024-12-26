const gradingSystems = {
    'Hueco (USA)': Array.from({ length: 18 }, (_, i) => ({ label: `V${i}`, value: `V${i}` })),
    Fontainebleau: [
        '3', '4-', '4', '4+', '5', '5+', '6A', '6A+', '6B', '6B+', '6C', '6C+', '7A',
        '7A+', '7B', '7B+', '7C', '7C+', '8A', '8A+', '8B', '8B+', '8C', '8C+', '9A',
    ].map((grade) => ({ label: grade, value: grade })),
};

export default gradingSystems;
