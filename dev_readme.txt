RCBC Computer Science Club Unnamed Microplatform

What: A small playground for making pixely games

Contribution rules:
Please use your own fork and make your changes in the 'dev' branch. When you're ready to commit, pull request to the main repo's dev branch.

Code rules:
- We're using camelCase for naming, except for designated prefixes, such as p_ and h_ for "platform" (internal to the platform, such as its resolution) and "html" (part of the page, such as the resolution of the canvas)
- Please write code that is generic and reusable; we prefer a more functional style wherever it makes sense
- If you're not sure what to do with this information, ask someone in the club!

Game object hierarchy (aka how things will actually get on the screen):
- PixelBuffer: an object encapsulating an array of pixels and its dimensions. Can be level graphics, the player, items, etc
- GameObject: anything that visually appears onscreen should be encapsulated in a GameObject (or subclass of GameObject) instance
    - for example, a background or level should be a GameObject with its graphic in the GameObject's 'graphic' member
-Scene: An object that keeps track of where GameObjects are relative to each other. Mostly for the advantage of camera positioning and layering

More classes:
- ObjectManager: handy container class to standardize updating GameObjects on every frame. put them all in there and call its update() function!
