const DATA_FILEDS = {
  INTENT_QUESTIONS: [
    {
      "name": "http://www.w3id.org/iSeeOnto/user#Debugging",
      "label": "Debugging",
      "questions": [
        {
          "text": "Is this the same outcome for others like this instance?",
          "target": "http://www.w3id.org/iSeeOnto/aimodel#Dataset"
        },
        {
          "text": "Is this instance a common occurrence?",
          "target": "http://www.w3id.org/iSeeOnto/aimodel#Dataset"
        }
      ]
    },
    {
      "name": "http://www.w3id.org/iSeeOnto/user#Transparency",
      "label": "Transparency",
      "questions": [
        {
          "text": "How much evidence have you considered to build the AI system?",
          "target": "http://www.w3id.org/iSeeOnto/aimodel#Dataset"
        },
        {
          "text": "How much evidence have you considered to make this prediction?",
          "target": "http://www.w3id.org/iSeeOnto/aimodel#Dataset"
        },
        {
          "text": "What are the possible outcomes?",
          "target": "http://www.w3id.org/iSeeOnto/aimodel#Dataset"
        },
        {
          "text": "What features are used?",
          "target": "http://www.w3id.org/iSeeOnto/aimodel#Dataset"
        },
        {
          "text": "To what extent does feature X impact the AI system?",
          "target": "https://purl.org/heals/eo#ArtificialIntelligenceMethod"
        },
        {
          "text": "What are the important features for the system?",
          "target": "https://purl.org/heals/eo#ArtificialIntelligenceMethod"
        },
        {
          "text": "What features does the system consider?",
          "target": "https://purl.org/heals/eo#ArtificialIntelligenceMethod"
        },
        {
          "text": "What is the scope of the AI system's capability?",
          "target": "https://purl.org/heals/eo#ArtificialIntelligenceMethod"
        },
        {
          "text": "How does the model respond to feature X?",
          "target": "https://purl.org/heals/eo#ArtificialIntelligenceMethod"
        },
        {
          "text": "To what extent does feature X impact the prediction?",
          "target": "https://purl.org/heals/eo#SystemRecommendation"
        },
        {
          "text": "How does feature X impact the prediction?",
          "target": "https://purl.org/heals/eo#SystemRecommendation"
        },
        {
          "text": "What are the necessary features that guarantee this prediction?",
          "target": "https://purl.org/heals/eo#SystemRecommendation"
        },
        {
          "text": "Why is instance X given prediction Y?",
          "target": "https://purl.org/heals/eo#SystemRecommendation"
        },
        {
          "text": "Which feature contributed to prediction Y?",
          "target": "https://purl.org/heals/eo#SystemRecommendation"
        }
      ]
    },
    {
      "name": "http://www.w3id.org/iSeeOnto/user#Performance",
      "label": "Performance",
      "questions": [
        {
          "text": "Which instances get prediction Y?",
          "target": "http://www.w3id.org/iSeeOnto/aimodel#Dataset"
        },
        {
          "text": "What are the results when other people use the AI System?",
          "target": "https://purl.org/heals/eo#ArtificialIntelligenceMethod"
        },
        {
          "text": "How reliable is the system?",
          "target": "https://purl.org/heals/eo#ArtificialIntelligenceMethod"
        },
        {
          "text": "In what situations does the system make errors?",
          "target": "https://purl.org/heals/eo#ArtificialIntelligenceMethod"
        },
        {
          "text": "What are the limitations of the system?",
          "target": "https://purl.org/heals/eo#ArtificialIntelligenceMethod"
        },
        {
          "text": "In what situations is the system likely to be correct?",
          "target": "https://purl.org/heals/eo#ArtificialIntelligenceMethod"
        },
        {
          "text": "How confident/accurate that this is the right prediction?",
          "target": "https://purl.org/heals/eo#SystemRecommendation"
        }
      ]
    },
    {
      "name": "http://www.w3id.org/iSeeOnto/user#Comprehensibility",
      "label": "Comprehensibility",
      "questions": [
        {
          "text": "What is the system overall logic?",
          "target": "https://purl.org/heals/eo#ArtificialIntelligenceMethod"
        },
        {
          "text": "What kind of algorithm is used in the system?",
          "target": "https://purl.org/heals/eo#ArtificialIntelligenceMethod"
        },
        {
          "text": "What does {term} mean?",
          "target": "https://purl.org/heals/eo#ArtificialIntelligenceMethod"
        },
        {
          "text": "How to improve the system performance?",
          "target": "https://purl.org/heals/eo#ArtificialIntelligenceMethod"
        }
      ]
    },
    {
      "name": "http://www.w3id.org/iSeeOnto/user#Effectiveness",
      "label": "Effectiveness",
      "questions": [
        {
          "text": "What does this prediction mean?",
          "target": "https://purl.org/heals/eo#SystemRecommendation"
        },
        {
          "text": "What kind of instance would get the same prediction?",
          "target": "https://purl.org/heals/eo#SystemRecommendation"
        },
        {
          "text": "What would the system predict if features X changed to Y?",
          "target": "https://purl.org/heals/eo#SystemRecommendation"
        }
      ]
    },
    {
      "name": "http://www.w3id.org/iSeeOnto/user#Actionability",
      "label": "Actionability",
      "questions": [
        {
          "text": "What kind of instance would get a different prediction?",
          "target": "https://purl.org/heals/eo#SystemRecommendation"
        },
        {
          "text": "How much can I change feature X to get the same prediction?",
          "target": "https://purl.org/heals/eo#SystemRecommendation"
        },
        {
          "text": "How to get a different prediction?",
          "target": "https://purl.org/heals/eo#SystemRecommendation"
        },
        {
          "text": "How to change the instance to get a different prediction?",
          "target": "https://purl.org/heals/eo#SystemRecommendation"
        },
        {
          "text": "Why is prediction X not Y?",
          "target": "https://purl.org/heals/eo#SystemRecommendation"
        },
      ]
    },
    {
      "name": "http://www.w3id.org/iSeeOnto/user#Compliancy",
      "label": "Compliancy",
      "questions": [
        {
          "text": "Why are instances A and B given different predictions?",
          "target": "https://purl.org/heals/eo#SystemRecommendation"
        }
      ]
    }
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
  QUESTION_METRIC: ['Free-Text', 'Number', 'Radio', 'Checkbox', 'Likert'],
};

export default DATA_FILEDS;
