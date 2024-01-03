<div align="center">
  <p>
    <h1>Monorepo Boilerplate</h1>
  </p>
  <p>
    boilerplate for TurboRepo
  </p>
  <p>
    <em>Leave a Like! or check out my portfolio <a href="https://arthurlee.bio">arthurlee.bio</a></em>
  </p>
</div>

## Documentation

```
      _             _             _             _    |  See No Evil +
     c -.          { ".          c "}          c ".  |  Hear No Evil +
\_   / \   +  \_   /\\   +  \_   / \/  =  \_   / \^  |  Speak No Evil =
  \_| ||        \_|  |        \_|  |        \_| ||   |  One Bored Monkey

```
---
Default Scopname is **@repo**
---
**If DB included add in package.json and turbo.json**
```js
//package.json
{
    ...,
    script:{
      "db:generate": "dotenv -- turbo run db:generate",
      "db:push": "dotenv -- turbo run db:push",
      "db:studio": "dotenv -- turbo run db:studio",
    }
}
//turbo.json
{
    ...,
    pipeline: {
      "db:generate": {
        "inputs": ["prisma/schema.prisma"],
        "cache": false,
        "env": ["DATABASE_URL"]
      },
      "db:push": {
        "inputs": ["prisma/schema.prisma"],
        "cache": false,
        "env": ["DATABASE_URL"]
      },
      "db:studio": {
        "inputs": ["prisma/schema.prisma"],
        "cache": false,
        "env": ["DATABASE_URL"]
      }
    }
}


```