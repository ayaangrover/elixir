export interface Lesson {
    id: number;
    title: string;
    content: string;
    code: string;
    practice: {
      instructions: string;
      initialCode: string;
      solution: string;
      test: (code: string) => boolean;
    };
  }
  
  export interface Chapter {
    id: number;
    title: string;
    description: string;
    lessons: Lesson[];
  }
  
  export const chapters: Chapter[] = [
    {
      id: 1,
      title: "Introduction to Potion Making",
      description: "Learn the basics of creating potions with code.",
      lessons: [
        {
          id: 1,
          title: "Your First Potion",
          content: "Let's start by creating a simple potion that outputs a message.",
          code: `Begin Making HelloPotion
  Say "Hello, young wizard!"
  Finish Making HelloPotion
  Bottle Potion HelloPotion`,
          practice: {
            instructions: "Create a potion that says 'I love magic!'",
            initialCode: `Begin Making MyFirstPotion
  # Your code here
  Finish Making MyFirstPotion
  Bottle Potion MyFirstPotion`,
            solution: `Begin Making MyFirstPotion
  Say "I love magic!"
  Finish Making MyFirstPotion
  Bottle Potion MyFirstPotion`,
            test: (code: string) => {
              const lowerCode = code.toLowerCase();
              return lowerCode.includes('say') && lowerCode.includes('love') && lowerCode.includes('magic');
            },
          },
        },
        {
          id: 2,
          title: "Variables in Potions",
          content: "Learn how to use variables to store magical ingredients.",
          code: `Begin Making VariablePotion
  Set ingredient = "dragon scales"
  Say "The main ingredient is:"
  Say ingredient
  Finish Making VariablePotion
  Bottle Potion VariablePotion`,
          practice: {
            instructions: "Create a potion that stores your name in a variable and then says it.",
            initialCode: `Begin Making NamePotion
  # Your code here
  Finish Making NamePotion
  Bottle Potion NamePotion`,
            solution: `Begin Making NamePotion
  Set name = "Your Name"
  Say "My name is:"
  Say name
  Finish Making NamePotion
  Bottle Potion NamePotion`,
            test: (code: string) => {
              const lowerCode = code.toLowerCase();
              return lowerCode.includes('set') && lowerCode.includes('say') && /say.*name/i.test(code);
            },
          },
        },
        {
          id: 3,
          title: "Basic Arithmetic",
          content: "Perform simple calculations in your potions.",
          code: `Begin Making MathPotion
  Set a = 5
  Set b = 3
  Add a b
  Subtract a b
  Multiply a b
  Divide a b
  Finish Making MathPotion
  Bottle Potion MathPotion`,
          practice: {
            instructions: "Create a potion that calculates the area of a rectangle with width 7 and height 3.",
            initialCode: `Begin Making AreaPotion
  # Your code here
  Finish Making AreaPotion
  Bottle Potion AreaPotion`,
            solution: `Begin Making AreaPotion
  Set width = 7
  Set height = 3
  Multiply width height
  Finish Making AreaPotion
  Bottle Potion AreaPotion`,
            test: (code: string) => {
              const lowerCode = code.toLowerCase();
              return lowerCode.includes('set') && lowerCode.includes('multiply') && 
                     (lowerCode.includes('width') || lowerCode.includes('height'));
            },
          },
        },
      ],
    },
    {
      id: 2,
      title: "Advanced Potion Techniques",
      description: "Learn more complex potion-making techniques.",
      lessons: [
        {
          id: 1,
          title: "Conditional Brewing",
          content: "Use conditional statements to create dynamic potions.",
          code: `Begin Making ConditionalPotion
  Set temperature = 100
  If temperature > 90
    Say "The potion is too hot!"
  Else
    Say "The potion temperature is just right."
  End If
  Finish Making ConditionalPotion
  Bottle Potion ConditionalPotion`,
          practice: {
            instructions: "Create a potion that checks if a 'magicPower' variable is greater than 50. If it is, say 'Strong magic!', otherwise say 'Keep practicing!'",
            initialCode: `Begin Making MagicCheckPotion
  Set magicPower = 75
  # Your code here
  Finish Making MagicCheckPotion
  Bottle Potion MagicCheckPotion`,
            solution: `Begin Making MagicCheckPotion
  Set magicPower = 75
  If magicPower > 50
    Say "Strong magic!"
  Else
    Say "Keep practicing!"
  End If
  Finish Making MagicCheckPotion
  Bottle Potion MagicCheckPotion`,
            test: (code: string) => {
              const lowerCode = code.toLowerCase();
              return lowerCode.includes('if') && lowerCode.includes('else') && 
                     lowerCode.includes('strong magic') && lowerCode.includes('keep practicing');
            },
          },
        },
        {
          id: 2,
          title: "Looping Enchantments",
          content: "Use loops to repeat magical processes.",
          code: `Begin Making LoopPotion
  Set counter = 0
  Repeat 5 times
    Add counter 1
    Say counter
  End Repeat
  Finish Making LoopPotion
  Bottle Potion LoopPotion`,
          practice: {
            instructions: "Create a potion that uses a loop to output the squares of numbers from 1 to 5.",
            initialCode: `Begin Making SquarePotion
  # Your code here
  Finish Making SquarePotion
  Bottle Potion SquarePotion`,
            solution: `Begin Making SquarePotion
  Set number = 1
  Repeat 5 times
    Multiply number number
    Say number
    Add number 1
  End Repeat
  Finish Making SquarePotion
  Bottle Potion SquarePotion`,
            test: (code: string) => {
              const lowerCode = code.toLowerCase();
              return lowerCode.includes('repeat') && lowerCode.includes('multiply') && lowerCode.includes('add');
            },
          },
        },
      ],
    },
  ];
  
  export const finalExam = {
    instructions: "Create a complex potion that demonstrates your mastery of all the concepts you've learned.",
    initialCode: `Begin Making MasteryPotion
  # Your code here
  Finish Making MasteryPotion
  Bottle Potion MasteryPotion`,
    solution: `Begin Making MasteryPotion
  Set base = 100
  Set modifier = 5
  Multiply base modifier
  Set result = base
  Repeat 3 times
    Add result 10
  End Repeat
  If result > 600
    Say "Potion is too strong!"
  Else
    Say "Potion is just right!"
  End If
  Finish Making MasteryPotion
  Bottle Potion MasteryPotion`,
    test: (code: string) => {
      const lowerCode = code.toLowerCase();
      return lowerCode.includes('set') && lowerCode.includes('multiply') && 
             lowerCode.includes('repeat') && lowerCode.includes('if') && lowerCode.includes('else');
    },
  };  