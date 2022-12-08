const DATA_FILEDS = {
  INTENT_QUESTIONS: [
    {
      name: 'http://www.w3id.org/iSeeOnto/user#Debugging',
      label: 'Debugging',
      questions: [
        {
          text: 'Is this the same outcome for similar instances?',
          target: 'http://www.w3id.org/iSeeOnto/aimodel#Dataset',
        },
        {
          text: 'Is this instance a common occurrence?',
          target: 'http://www.w3id.org/iSeeOnto/aimodel#Dataset',
        },
      ],
    },
    {
      name: 'http://www.w3id.org/iSeeOnto/user#Transparency',
      label: 'Transparency',
      questions: [
        {
          text: 'How much evidence has been considered to build the AI system?',
          target: 'http://www.w3id.org/iSeeOnto/aimodel#Dataset',
        },
        {
          text: 'How much evidence has been considered in the current outcome?',
          target: 'http://www.w3id.org/iSeeOnto/aimodel#Dataset',
        },
        {
          text: 'What are the possible outcomes of the AI system?',
          target: 'http://www.w3id.org/iSeeOnto/aimodel#Dataset',
        },
        {
          text: 'What features are used by the AI system? ',
          target: 'http://www.w3id.org/iSeeOnto/aimodel#Dataset',
        },
        {
          text: 'What is the impact of feature {feature} on the AI system?',
          target: 'https://purl.org/heals/eo#ArtificialIntelligenceMethod',
        },
        {
          text: 'What are the important features for the AI system?',
          target: 'https://purl.org/heals/eo#ArtificialIntelligenceMethod',
        },
        {
          text: 'What features does the AI system consider?',
          target: 'https://purl.org/heals/eo#ArtificialIntelligenceMethod',
        },
        {
          text: 'What is the scope of the AI system capabilities?',
          target: 'https://purl.org/heals/eo#ArtificialIntelligenceMethod',
        },
        {
          text: 'What is the goal of the AI system?',
          target: 'https://purl.org/heals/eo#ArtificialIntelligenceMethod',
        },
        {
          text: 'How does the AI system respond to feature {feature}?',
          target: 'https://purl.org/heals/eo#ArtificialIntelligenceMethod',
        },
        {
          text: 'What is the impact of feature {feature} on the outcome?',
          target: 'https://purl.org/heals/eo#SystemRecommendation',
        },
        {
          text: 'How does feature {feature} impact the outcome?',
          target: 'https://purl.org/heals/eo#SystemRecommendation',
        },
        {
          text: 'What are the necessary features that guarantee this outcome?',
          target: 'https://purl.org/heals/eo#SystemRecommendation',
        },
        {
          text: 'Why does the AI system have given outcome A?',
          target: 'https://purl.org/heals/eo#SystemRecommendation',
        },
        {
          text: 'Which feature contributed to the current outcome?',
          target: 'https://purl.org/heals/eo#SystemRecommendation',
        },
      ],
    },
    {
      name: 'http://www.w3id.org/iSeeOnto/user#Performance',
      label: 'Performance',
      questions: [
        {
          text: 'Which instances get a similar outcome?',
          target: 'http://www.w3id.org/iSeeOnto/aimodel#Dataset',
        },
        {
          text: 'Which instances get outcome {outcome}?',
          target: 'http://www.w3id.org/iSeeOnto/aimodel#Dataset',
        },
        {
          text: 'What are the results when others use the AI System?',
          target: 'https://purl.org/heals/eo#ArtificialIntelligenceMethod',
        },
        {
          text: 'How accurate is the AI system?',
          target: 'https://purl.org/heals/eo#ArtificialIntelligenceMethod',
        },
        {
          text: 'How reliable is the AI system?',
          target: 'https://purl.org/heals/eo#ArtificialIntelligenceMethod',
        },
        {
          text: 'In what situations does the AI system make errors?',
          target: 'https://purl.org/heals/eo#ArtificialIntelligenceMethod',
        },
        {
          text: 'What are the limitations of the AI system?',
          target: 'https://purl.org/heals/eo#ArtificialIntelligenceMethod',
        },
        {
          text: 'In what situations is the AI system likely to be correct?',
          target: 'https://purl.org/heals/eo#ArtificialIntelligenceMethod',
        },
        {
          text: 'How confident is the AI system with the outcome?',
          target: 'https://purl.org/heals/eo#SystemRecommendation',
        },
      ],
    },
    {
      name: 'http://www.w3id.org/iSeeOnto/user#Comprehensibility',
      label: 'Comprehensibility',
      questions: [
        {
          text: 'What is the overall logic of the AI system?',
          target: 'https://purl.org/heals/eo#ArtificialIntelligenceMethod',
        },
        {
          text: 'What kind of algorithm is used in the AI system?',
          target: 'https://purl.org/heals/eo#ArtificialIntelligenceMethod',
        },
        {
          text: 'What does {term} mean?',
          target: 'https://purl.org/heals/eo#ArtificialIntelligenceMethod',
        },
        {
          text: 'How to improve the AI system performance?',
          target: 'https://purl.org/heals/eo#ArtificialIntelligenceMethod',
        },
      ],
    },
    {
      name: 'http://www.w3id.org/iSeeOnto/user#Effectiveness',
      label: 'Effectiveness',
      questions: [
        {
          text: 'How does the AI system react if feature {feature} is changed?',
          target: 'https://purl.org/heals/eo#ArtificialIntelligenceMethod',
        },
        {
          text: 'What is the impact of the current outcome?',
          target: 'https://purl.org/heals/eo#SystemRecommendation',
        },
        {
          text: 'What other instances would get the same outcome?',
          target: 'https://purl.org/heals/eo#SystemRecommendation',
        },
        {
          text: 'What would be the outcome if features {feature} is changed to {value}?',
          target: 'https://purl.org/heals/eo#SystemRecommendation',
        },
      ],
    },
    {
      name: 'http://www.w3id.org/iSeeOnto/user#Actionability',
      label: 'Actionability',
      questions: [
        {
          text: 'What are the alternative scenarios available?',
          target: 'https://purl.org/heals/eo#SystemRecommendation',
        },
        {
          text: 'What type of instances would get a different outcome?',
          target: 'https://purl.org/heals/eo#SystemRecommendation',
        },
        {
          text: 'How can I change feature {feature} to get the same outcome?',
          target: 'https://purl.org/heals/eo#SystemRecommendation',
        },
        {
          text: 'How to get a different outcome?',
          target: 'https://purl.org/heals/eo#SystemRecommendation',
        },
        {
          text: 'How to change the instance to get a different outcome?',
          target: 'https://purl.org/heals/eo#SystemRecommendation',
        },
        {
          text: 'How to change the instance to get outcome {outcome}?',
          target: 'https://purl.org/heals/eo#SystemRecommendation',
        },
        {
          text: 'Why does the AI system have given outcome {outcomeA} not {outcomeB}?',
          target: 'https://purl.org/heals/eo#SystemRecommendation',
        },
        {
          text: 'Which features need changed to get a different outcome?',
          target: 'https://purl.org/heals/eo#SystemRecommendation',
        },
      ],
    },
    {
      name: 'http://www.w3id.org/iSeeOnto/user#Compliancy',
      label: 'Compliancy',
      questions: [
        {
          text: 'Why are instances {instanceA} and {instanceB} given different predictions?',
          target: 'https://purl.org/heals/eo#SystemRecommendation',
        },
        {
          text: 'How well does the AI system capture the real-world?',
          target: 'http://www.w3id.org/iSeeOnto/aimodel#Dataset',
        },
      ],
    },
  ],
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
    'Custom',
  ],
  QUESTION_METRIC: ['Free-Text', 'Number', 'Radio', 'Checkbox', 'Likert', 'Info'],
};

export default DATA_FILEDS;
