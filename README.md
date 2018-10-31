# Generate Jest Tests from TypeScript

**Is this library for you?**

Perhaps. Does one or more of the following apply to you?

- You think writing tests is important but don't like the boilerplate.
- Your PR is failing CI because you have dropped below the minimum level of code coverage and you need to get that number up quick.
- You have started using Typescript and have wondered to yourself, "Is there anything TypeScript can't do?"

**What does it do?**

It uses the TypeScript compiler to analyze a file with a function or class that returns a React Component and generates a test file for you. That's cool. But what is even cooler is that, if you provide the types of the props, then it will generate the default props using those types. You gotta admit, that's pretty cool.

```
Give examples
```

## Getting Started

### Installing

1. Clone this repository
2. `cd generate-test`
3. `npm link`
4. Find a tsx file (let's pretent its called source.tsx) and run `generate-test source.tsx`
5. You will find the generated file in the same directory

## Todos:

1. Accept a destination directory as an argument
2. Improve sample data

## Contributing

All PRs and Issues and any other kind of input are most welcome.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
