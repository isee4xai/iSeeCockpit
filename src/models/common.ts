const DATA_FILEDS = {
    AITask: ["Abductive Task", "Classification", "Anomaly Detection", "Deductive Task", "Forecasting", "Inductive Task"],
    AIMethod: ["Computer Heuristics", "Fuzzy Logic", "Knowledge based Systems", "Expert Systems", "Knowledge Bases", "Biological Ontologies", "Machine Learning", "Supervised Machine Learning", "Unsupervised Machine Learning", "Natural Language Processing", "Term frequency", "ÄìInverse document frequency", "Neural Networks (Computer)", "Robotics"],
    Datatype: ['Tabular', 'Image', 'Textual'],
    ModelOutcome: ['Binary', 'Multi-Class', 'Range'],
    AssetmentType: ['Accuracy', 'F1 Score', "Precision", "Recall", "AUC", "Error Rate", "Top K Accuracy", "Jaccard Score", "Explained Variance", "Mean Absolute Error", "Mean Squared Error", "Adjusted Mutual Info Score", "Adjusted Rand Score", "Completeness Score", "Mutual Info Score"],
    IntentType: [
        'Debugging',
        'Education',
        'Effectiveness',
        'Efficiency',
        'Persuasiveness',
        'Satisfaction',
        'Scruitablity',
        'Transparency',
        'Trust',
    ],
    QUESTION_CATEGORY: [
        'Goodness',
        'Satisfaction',
        'Mental Model',
        'Curiosity',
        'Trust',
        'Performance',
        'Custom'
    ],
    QUESTION_METRIC: ['Free-Text', 'Number', 'Radio', 'Checkbox', 'Likert'],
};


export default DATA_FILEDS;