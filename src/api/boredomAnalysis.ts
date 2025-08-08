// Mock API for boredom analysis
// In a real app, this would call an actual AI service

interface BoredomResult {
  boredomPercentage: number;
  message: string;
  audioType: 'chill' | 'bruh' | 'coffin';
}

const messages = {
  low: [
    "You're only {}% bored? Amateur! 😏 Your teacher must be doing something right!",
    "{}% bored? That's cute! Wait until you hit advanced calculus! 🤓",
    "Only {}% bored? You're practically vibrating with excitement! Try harder! ⚡",
    "{}% bored? What are you, actually paying attention? Suspicious... 🧐",
    "{}% bored? Your enthusiasm is showing. Quick, look more dead inside! 💀"
  ],
  medium: [
    "{}% bored? Now we're getting somewhere! You're in the danger zone! 😴",
    "{}% bored? Perfect! You've achieved that classic 'dead behind the eyes' look! 👁",
    "{}% bored? Your soul is slowly leaving your body... we can see it! 👻",
    "{}% bored? Congratulations, you've mastered the art of existing without living! 🏆",
    "{}% bored? Your teacher's probably wondering if you're still breathing! 💨"
  ],
  high: [
    "{}% bored?! RIP your will to live! 😵 Someone call the authorities!",
    "{}% bored?! You've transcended boredom and entered another dimension! 🌌",
    "{}% bored?! Your spirit animal is a sloth on sedatives! 🦥💤",
    "{}% bored?! Even watching paint dry would be more exciting than this! 🎨",
    "{}% bored?! You've achieved legendary status! Students will study your technique! 📚👑",
    "{}% bored?! Your boredom is so intense it's creating a black hole! 🕳",
    "{}% bored?! You're so bored you make sloths look hyperactive! 🦥⚡"
  ]
};

export const analyzeBoredom = async (imageData: string): Promise<BoredomResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Generate random boredom percentage (with some weighting toward higher values for fun)
  const random = Math.random();
  let boredomPercentage: number;
  
  if (random < 0.2) {
    // 20% chance of low boredom (0-30%)
    boredomPercentage = Math.floor(Math.random() * 31);
  } else if (random < 0.6) {
    // 40% chance of medium boredom (31-70%)
    boredomPercentage = Math.floor(Math.random() * 40) + 31;
  } else {
    // 40% chance of high boredom (71-100%)
    boredomPercentage = Math.floor(Math.random() * 30) + 71;
  }

  // Select appropriate message and audio type
  let messageArray: string[];
  let audioType: 'chill' | 'bruh' | 'coffin';

  if (boredomPercentage <= 30) {
    messageArray = messages.low;
    audioType = 'chill';
  } else if (boredomPercentage <= 70) {
    messageArray = messages.medium;
    audioType = 'bruh';
  } else {
    messageArray = messages.high;
    audioType = 'coffin';
  }

  const randomMessage = messageArray[Math.floor(Math.random() * messageArray.length)];
  const message = randomMessage.replace('{}', boredomPercentage.toString());

  return {
    boredomPercentage,
    message,
    audioType
  };
};