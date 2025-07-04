# SpeedType - A Typing App I Built

Hey there! 👋 I built this typing app because I was tired of the same old boring typing tests out there. I wanted something that actually felt good to use, looked modern, and helped me improve my typing skills in a meaningful way.

## What's This About?

This is a typing test app I built with React and TypeScript. It's got all the usual stuff like WPM tracking and accuracy measurement, but I also added some cool features that make it actually fun to use:

- **Real-time feedback** - You see your mistakes highlighted as you type
- **Multiple text sources** - Quotes, programming code, random words, whatever floats your boat
- **Nice animations** - Because who doesn't love a good confetti celebration when you finish?
- **Dark/light mode** - Because my eyes get tired staring at bright screens all day
- **Sound effects** - Optional, but satisfying when you nail a word

## The Tech Stuff

I used:
- **React** with TypeScript (because I like my code to actually work)
- **Tailwind CSS** (because writing CSS from scratch is the worst)
- **Framer Motion** for animations (makes everything feel smooth)
- **Recharts** for the stats (because I'm a data nerd)

## Getting Started

If you want to run this locally:

```bash
# Clone it
git clone <your-repo-url>
cd typing-app/client

# Install the dependencies
npm install

# Start the dev server
npm start
```

That's it! Open http://localhost:3000 and start typing.

## How to Use It

1. **Pick your poison** - Choose what kind of text you want to type (quotes, code, etc.)
2. **Start typing** - Just start typing and the timer will begin automatically
3. **Watch your stats** - WPM, accuracy, and errors update in real-time
4. **Finish strong** - Complete the text and see your results with some celebratory confetti

The app saves your results locally, so you can track your progress over time. Check out the Statistics page to see how you're improving.

## Features I'm Proud Of

### The Typing Experience
I spent way too much time getting the typing feel just right. The cursor blinks properly, errors are highlighted immediately, and the text flows naturally. It's the little things that make it feel polished.

### The Stats Dashboard
I'm a sucker for data visualization, so I went all out on the statistics page. You get charts showing your WPM progress, accuracy distribution, and all that good stuff. It's actually motivating to see your improvement over time.

### The Settings
I made it customizable because everyone has different preferences. You can adjust font size, toggle sounds, change themes, and more. It's your typing experience, after all.

## User Accounts & Vocabulary Learning

I recently added user authentication with Supabase and an adaptive vocabulary learning system. Now you can:

- **Sign up/sign in** to save your progress across devices
- **Learn new words** while typing - the app tracks which words you struggle with
- **Spaced repetition** - Words you miss come back for review at the right intervals
- **Personalized practice** - The app learns what you need to work on

Check out the `SUPABASE_SETUP.md` file if you want to set this up for yourself.

## Building for Production

```bash
npm run build
```

This creates a `build` folder you can deploy anywhere. I've deployed it on Vercel and it works great.

## The Code Structure

```
src/
├── components/          # React components
│   ├── AdvancedTypingTest.tsx    # The main typing interface
│   ├── Statistics.tsx            # Charts and analytics
│   ├── Settings.tsx              # User preferences
│   └── AuthPanel.tsx             # Login/signup stuff
├── services/           # Business logic and API calls
│   ├── textGenerator.ts          # Gets random text to type
│   ├── vocabularyGenerator.ts    # Handles word learning
│   ├── adaptiveVocab.ts          # Spaced repetition logic
│   └── supabaseClient.ts         # Database connection
└── App.tsx             # Main app component
```

## What I Learned Building This

- **React Hooks** are amazing for state management
- **TypeScript** catches so many bugs before they happen
- **Tailwind CSS** makes styling actually enjoyable
- **User experience** matters way more than I initially thought
- **Performance optimization** is crucial for smooth typing

## Contributing

Found a bug? Want to add a feature? Feel free to open an issue or submit a pull request. I'm always open to improvements!

## License

MIT License - do whatever you want with it.

---

Thanks for checking out my typing app! I hope it helps you improve your typing skills as much as building it helped me improve my coding skills.

Happy typing! ⌨️
