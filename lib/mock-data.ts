export interface GraphNode {
  id: string;
  label: string;
  imgUrl: string;
  type: 'ROOT' | 'DERIVATIVE';
  description?: string;
}

export interface GraphLink {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

const ROOT_IMAGES = [
  'https://picsum.photos/id/237/200/200',
  'https://picsum.photos/id/1/200/200',
  'https://picsum.photos/id/10/200/200',
  'https://picsum.photos/id/100/200/200',
  'https://picsum.photos/id/1000/200/200',
];

const DERIVATIVE_IMAGES = [
  'https://picsum.photos/id/101/200/200',
  'https://picsum.photos/id/1015/200/200',
  'https://picsum.photos/id/1016/200/200',
  'https://picsum.photos/id/1018/200/200',
  'https://picsum.photos/id/1019/200/200',
  'https://picsum.photos/id/102/200/200',
  'https://picsum.photos/id/1020/200/200',
  'https://picsum.photos/id/1021/200/200',
  'https://picsum.photos/id/1022/200/200',
  'https://picsum.photos/id/1023/200/200',
  'https://picsum.photos/id/1024/200/200',
  'https://picsum.photos/id/1025/200/200',
];

export const MOCK_DATA: GraphData = {
  nodes: [
    { id: 'ip-root-1', label: 'The Origin Story', imgUrl: ROOT_IMAGES[0], type: 'ROOT', description: 'The original IP asset that started it all.' },
    { id: 'ip-root-2', label: 'Cyber Chronicles', imgUrl: ROOT_IMAGES[1], type: 'ROOT', description: 'A cyberpunk saga root IP.' },
    { id: 'ip-dev-1', label: 'Chapter 1: Awakening', imgUrl: DERIVATIVE_IMAGES[0], type: 'DERIVATIVE', description: 'First derivative work based on The Origin Story.' },
    { id: 'ip-dev-2', label: 'Character: Zero', imgUrl: DERIVATIVE_IMAGES[1], type: 'DERIVATIVE', description: 'A character spin-off.' },
    { id: 'ip-dev-3', label: 'Audio Adaptation', imgUrl: DERIVATIVE_IMAGES[2], type: 'DERIVATIVE', description: 'Audiobook version.' },
    { id: 'ip-dev-4', label: 'Movie Script', imgUrl: DERIVATIVE_IMAGES[3], type: 'DERIVATIVE', description: 'Screenplay adaptation.' },
    { id: 'ip-dev-5', label: 'Merch Design', imgUrl: DERIVATIVE_IMAGES[4], type: 'DERIVATIVE', description: 'T-shirt design asset.' },
    { id: 'ip-dev-6', label: 'Remix Vol. 1', imgUrl: DERIVATIVE_IMAGES[5], type: 'DERIVATIVE', description: 'Musical remix.' },
    { id: 'ip-dev-7', label: 'Fan Fiction', imgUrl: DERIVATIVE_IMAGES[6], type: 'DERIVATIVE', description: 'Community contribution.' },
    { id: 'ip-dev-8', label: 'Sequel Draft', imgUrl: DERIVATIVE_IMAGES[7], type: 'DERIVATIVE', description: 'Draft for the sequel.' },
    { id: 'ip-dev-9', label: 'Prequel Concept', imgUrl: DERIVATIVE_IMAGES[8], type: 'DERIVATIVE', description: 'Concept art for prequel.' },
    { id: 'ip-dev-10', label: 'Game Asset', imgUrl: DERIVATIVE_IMAGES[9], type: 'DERIVATIVE', description: '3D model for game.' },
  ],
  links: [
    { source: 'ip-root-1', target: 'ip-dev-1' },
    { source: 'ip-root-1', target: 'ip-dev-2' },
    { source: 'ip-dev-1', target: 'ip-dev-3' },
    { source: 'ip-dev-1', target: 'ip-dev-4' },
    { source: 'ip-dev-2', target: 'ip-dev-5' },
    { source: 'ip-root-2', target: 'ip-dev-6' },
    { source: 'ip-dev-6', target: 'ip-dev-7' },
    { source: 'ip-dev-6', target: 'ip-dev-8' },
    { source: 'ip-dev-4', target: 'ip-dev-9' },
    { source: 'ip-dev-4', target: 'ip-dev-10' },
    // Cross-pollination
    { source: 'ip-dev-2', target: 'ip-dev-6' },
  ]
};
