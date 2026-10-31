// Trails from an ancient idea to today. "innovations" follows the nine examples the curriculum
// lists for outcome Fy8zbilfU0yzOlpS8c5Cdg (K1.3). "issues" follows the three examples it lists
// for outcome MRmYJnVX90eGJ1QhgKk-eg (K1.1).

export interface Trail {
  id: string;
  icon: string;
  title: string;
  stops: { when: string; text: string }[];
  /** Optional closing line: what the trail teaches. */
  insight?: string;
}

export const TRAILS: Record<string, Trail[]> = {
  innovations: [
    {
      id: 'writing',
      icon: '✍️',
      title: 'Writing systems',
      stops: [
        { when: 'Egypt, about 3200 BCE', text: 'Hieroglyphs: small pictures that stand for sounds and ideas.' },
        { when: 'Greece, about 800 BCE', text: 'An alphabet with letters for vowels as well as consonants.' },
        { when: 'Rome, by about 500 BCE', text: 'The Latin alphabet, based on Greek letters by way of the Etruscans.' },
        { when: 'Today', text: 'The letters you are reading right now come from the Latin alphabet.' },
      ],
    },
    {
      id: 'agriculture',
      icon: '🌾',
      title: 'Agriculture',
      stops: [
        { when: 'Egypt, thousands of years ago', text: 'Farmers led Nile floodwater into basins and canals to water their crops.' },
        { when: 'Rome and China', text: 'Bigger canals, and iron ploughs pulled by oxen.' },
        { when: 'Today', text: 'Southern Alberta farmers water crops through canals and sprinklers. The idea is the same: bring water to the field.' },
      ],
    },
    {
      id: 'architecture',
      icon: '🏛️',
      title: 'Architecture',
      stops: [
        { when: 'Greece, 400s BCE', text: 'Temples with rows of columns, such as the Parthenon.' },
        { when: 'Rome, about 125 CE', text: 'Concrete and arches made huge domes possible, such as the Pantheon.' },
        { when: 'Today', text: 'The Alberta Legislature in Edmonton has a dome and tall columns.' },
      ],
    },
    {
      id: 'calendars',
      icon: '📅',
      title: 'Calendars',
      stops: [
        { when: 'Egypt', text: 'A year of 365 days, tied to the yearly flood of the Nile.' },
        { when: 'Rome, 45 BCE', text:'Julius Caesar’s calendar added a leap day every 4 years. July is named for him.' },
        { when: 'Today', text: 'Our calendar is a small correction of that Roman calendar, made in 1582.' },
      ],
    },
    {
      id: 'trade',
      icon: '🪙',
      title: 'Trade, currency and economics',
      stops: [
        { when: 'China, about 1000 BCE', text: 'Cowrie shells were used as money. Later came bronze money shaped like tools and knives.' },
        { when: 'Greece and Rome', text: 'Metal coins stamped with a mark that showed their worth.' },
        { when: 'Today', text: 'Coins, bank notes and cards. A card still stands for value that you can trade.' },
      ],
    },
    {
      id: 'literature',
      icon: '📜',
      title: 'Literature and philosophy',
      stops: [
        { when: 'India and Greece', text: 'Long story poems such as the Ramayana and the Odyssey.' },
        { when: 'China and Greece, about 500 to 400 BCE', text: 'Thinkers such as Confucius and Socrates asked how people should live.' },
        { when: 'Today', text: 'These works are still read. Hero journeys in books and films follow the same pattern.' },
      ],
    },
    {
      id: 'math',
      icon: '🔢',
      title: 'Mathematics and science',
      stops: [
        { when: 'India, by about 500 CE', text: 'Number symbols with place value, and later a zero.' },
        { when: 'Arab scholars, about 800 CE', text: 'Al-Khwarizmi wrote about these numbers. The word “algorithm” comes from his name.' },
        { when: 'Today', text: 'The digits 0 to 9 that you use, and the algorithms inside every computer.' },
      ],
    },
    {
      id: 'decisions',
      icon: '🗳️',
      title: 'Systems of decision making',
      stops: [
        { when: 'Athens, about 500 BCE', text: 'Citizens gathered and voted on decisions themselves. Only free men could vote.' },
        { when: 'Rome', text: 'Elected officials, and a group of leaders called the Senate.' },
        { when: 'Today', text: 'Canadians elect people to make decisions, and Canada has a Senate too.' },
      ],
    },
    {
      id: 'rights',
      icon: '⚖️',
      title: 'Rights and freedoms',
      stops: [
        { when: 'Rome, about 450 BCE', text: 'The Twelve Tables put laws in writing, where people could see them.' },
        { when: 'India, about 250 BCE', text: 'Emperor Ashoka carved messages on stone, asking people to respect other religions.' },
        { when: 'Today', text: 'The Canadian Charter of Rights and Freedoms, written into law in 1982.' },
      ],
    },
  ],
  issues: [
    {
      id: 'technology',
      icon: '⚙️',
      title: 'The evolution of technology',
      stops: [
        { when: 'Then', text: 'Roman aqueducts brought clean water to cities, but they cost a great deal to build and keep up.' },
        { when: 'Today', text: 'Towns in Alberta still pay to build and repair water pipes and treatment plants.' },
      ],
      insight: 'New technology solves problems, and someone must pay to keep it running.',
    },
    {
      id: 'exploration',
      icon: '🧭',
      title: 'The economic impact of exploration and trade',
      stops: [
        { when: 'Then', text: 'Silk Road trade made some cities very rich. When trade moved to the sea, cities such as Petra lost out.' },
        { when: 'Today', text: 'When a big company or trade route moves, the jobs in a town can change too.' },
      ],
      insight: 'Trade creates wealth, and changes in trade can hurt the people who depend on it.',
    },
    {
      id: 'government',
      icon: '🏛️',
      title: 'The successes and failures of social and government systems',
      stops: [
        { when: 'Then', text: 'Athens let citizens vote, which was a success. It left out women and enslaved people, which was a failure.' },
        { when: 'Today', text: 'In Canada, the vote widened over time. Most women could vote federally by 1918, and First Nations people living on reserve by 1960.' },
      ],
      insight: 'Studying who was left out helps us ask who might be left out now.',
    },
  ],
};
