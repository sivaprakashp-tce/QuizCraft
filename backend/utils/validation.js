export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password) => {
    // At least 6 characters, at least one letter and one number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
    return passwordRegex.test(password);
};

export const validateObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
};

export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    
    // Remove potentially dangerous characters
    return input
        .replace(/[<>]/g, '')
        .trim();
};

export const validateQuizAnswers = (answers, questions) => {
    if (!Array.isArray(answers) || !Array.isArray(questions)) {
        return {
            isValid: false,
            error: 'Answers and questions must be arrays'
        };
    }

    if (answers.length !== questions.length) {
        return {
            isValid: false,
            error: 'Number of answers must match number of questions'
        };
    }

    for (let i = 0; i < answers.length; i++) {
        const answer = answers[i];
        const question = questions[i];

        if (typeof answer.selectedAnswer !== 'number' || 
            answer.selectedAnswer < 0 || 
            answer.selectedAnswer >= question.options.length) {
            return {
                isValid: false,
                error: `Invalid answer for question ${i + 1}`
            };
        }

        if (answer.questionId !== question._id.toString()) {
            return {
                isValid: false,
                error: `Question ID mismatch for question ${i + 1}`
            };
        }
    }

    return { isValid: true };
};
