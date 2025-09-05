const mongoose = require("mongoose");
const Group =require("./models/Groups"); // adjust path if needed
require("dotenv").config();
// your JSON data
const data = {
  "1": [
    "english",
    "ganit",
    "hindi",
    "math"
  ],
  "2": [
    "english",
    "ganit",
    "hindi",
    "math"
  ],
  "3": [
    "english",
    "evs",
    "evs � hindi",
    "ganit",
    "hindi",
    "math"
  ],
  "4": [
    "english",
    "evs",
    "evs � hindi",
    "ganit",
    "hindi",
    "math"
  ],
  "5": [
    "english",
    "evs",
    "evs � hindi",
    "ganit",
    "hindi",
    "math"
  ],
  "6": [
    "english",
    "hindi",
    "math",
    "sanskrit",
    "science",
    "science - hindi",
    "social science"
  ],
  "7": [
    "english - an alien hand",
    "english - honeycomb",
    "geography",
    "geography - hindi",
    "hindi - bal mahabharat katha",
    "hindi - durva",
    "hindi - vasant",
    "history",
    "history - hindi",
    "math",
    "math - hindi",
    "political science",
    "political science - hindi",
    "sanskrit",
    "science",
    "science - hindi"
  ],
  "8": [
    "english - honeydew",
    "english - it so happened",
    "geography",
    "geography - hindi",
    "hindi - bharat ki khoj",
    "hindi - durva",
    "hindi - sanshipt budhcharit",
    "hindi - vasant",
    "history",
    "history - hindi",
    "math",
    "math - hindi",
    "politocal science",
    "politocal science - hindi",
    "sanskrit",
    "science",
    "science - hindi"
  ],
  "9": [
    "economics",
    "economics - hindi",
    "english - beehive",
    "english - moments",
    "geography",
    "geography - hindi",
    "hindi - kritika",
    "hindi - kshitij",
    "hindi - sanchayan",
    "hindi - sprash",
    "history",
    "history - hindi",
    "math",
    "math - hindi",
    "physical education",
    "political science (civics)",
    "political science (civics) - hindi",
    "sanskrit - abhyaswaan bhav",
    "sanskrit - shemushi",
    "sanskrit - vyakaranavithi",
    "science",
    "science - hindi"
  ],
  "10": [
    "economics",
    "economics - hindi",
    "english - first flight",
    "english - footprints without feet",
    "geography",
    "geography - hindi",
    "hindi - kritika",
    "hindi - kshitij",
    "hindi - sanchayan",
    "hindi - sparsh",
    "history",
    "history - hindi",
    "math",
    "math - hindi",
    "physical education",
    "political science (civics)",
    "political science (civics) - hindi",
    "sanskrit - abhyaswaan bhav",
    "sanskrit - shemushi",
    "sanskrit - vyakaranavithi",
    "science",
    "science - hindi"
  ],
  "11": [
    "accountancy part 1 - hindi",
    "accountancy part 2 - hindi",
    "accountancy-1",
    "accountancy-2",
    "biology",
    "biology - hindi",
    "business studies",
    "business studies - hindi",
    "chemistry part-1",
    "chemistry part-1 - hindi",
    "chemistry part-2",
    "chemistry part-2 - hindi",
    "economics - indian economic development",
    "economics - statistics",
    "english - hornbill",
    "english - snapshots",
    "geography - bhart bhautik paryabaran",
    "geography - bhugol main prayogatmak karya",
    "geography - bhutiq bhugol ke mul sidhant",
    "geography - fundamental of physical geography",
    "geography - india physical environment",
    "geography - pratical work in geography",
    "hindi - antra",
    "hindi - antral",
    "hindi - aroh",
    "hindi - vitan",
    "history",
    "history - hindi",
    "home science part 1",
    "home science part 1 - hindi",
    "home science part 2",
    "home science part 2 - hindi",
    "math",
    "math - hindi",
    "physical education",
    "physics part-1",
    "physics part-1 - hindi",
    "physics part-2",
    "physics part-2 - hindi",
    "political science part 1",
    "political science part 1 - hindi",
    "political science part 2",
    "political science part 2 - hindi",
    "psychology",
    "psychology - hindi",
    "sanskrit - bhaswati",
    "sanskrit - shashwati",
    "sociology - introducing sociology",
    "sociology - samaj ka bodh",
    "sociology - samaj shastra parichay",
    "sociology - understanding society"
  ],
  "12": [
    "accountancy part 1",
    "accountancy part 1 - hindi",
    "accountancy part 2",
    "accountancy part 2 - hindi",
    "biology",
    "biology - hindi",
    "business studies part 1",
    "business studies part 1 - hindi",
    "business studies part 2",
    "business studies part 2 - hindi",
    "chemistry part 1",
    "chemistry part 1 - hindi",
    "chemistry part 2",
    "chemistry part 2 - hindi",
    "english - flamingo",
    "english - vistas",
    "geography - bharat log aur arthvyasastha",
    "geography - bhugol main pryogatmak karye",
    "geography - fundamental of human geography",
    "geography - india people and economy",
    "geography - manav bhugol ke mool sidhant",
    "geography - practical work in geography",
    "hindi - antra",
    "hindi - antral",
    "hindi - aroh",
    "hindi - vitan",
    "history part 1",
    "history part 1 - hindi",
    "history part 2",
    "history part 2 - hindi",
    "history part 3",
    "history part 3 - hindi",
    "home science part 1",
    "home science part 1 - hindi",
    "home science part 2",
    "home science part 2 - hindi",
    "macroeconomics",
    "macroeconomics - hindi",
    "math part 1",
    "math part 1 - hindi",
    "math part 2",
    "math part 2 - hindi",
    "microeconomics",
    "microeconomics - hindi",
    "physics part 1",
    "physics part 1 - hindi",
    "physics part 2",
    "physics part 2 - hindi",
    "political science part 1",
    "political science part 1 - hindi",
    "political science part 2",
    "political science part 2 - hindi",
    "psychology",
    "psychology - hindi",
    "sanskrit - bhaswati",
    "sanskrit - shashwati",
    "sociology part 1",
    "sociology part 1 - hindi",
    "sociology part 2",
    "sociology part 2 - hindi"
  ]
};

async function seed() {
  try {
    // connect to DB
    await mongoose.connect(process.env.DATABASE_URL); // replace db name if different
    console.log("✅ MongoDB Connected");

    // clear old groups (optional)
    await Group.deleteMany({});
    console.log("🗑️ Old groups removed");

    // build new groups
    let groups = [];
    for (const [className, subjects] of Object.entries(data)) {
      for (const subject of subjects) {
        groups.push({
          class: parseInt(className),
          subject,
          name: `Class ${className} - ${subject}`,
        });
      }
    }

    // insert into DB
    await Group.insertMany(groups);
    console.log("🎉 Groups seeded successfully");

    process.exit();
  } catch (err) {
    console.error("❌ Error seeding groups:", err);
    process.exit(1);
  }
}

seed();
