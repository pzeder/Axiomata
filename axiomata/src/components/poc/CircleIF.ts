export interface CircleData {
  id: number;
  xpos: number;
  ypos: number;
  radius: number;
  color: string;
}

export interface CircleInstance {
  setPos: (x: number, y: number) => void;
  setRadius: (event: any) => void;
  setColor: (c: string) => void;
  getX: () => number;
  getY: () => number;
  getRadius: () => number;
  getColor: () => string;
}