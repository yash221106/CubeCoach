declare module 'cubejs' {
  interface CubeInstance {
    solve(): string;
  }
  
  export function fromString(cubeString: string): CubeInstance;
}