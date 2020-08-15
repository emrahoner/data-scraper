import JsonTraverser from './json-object-traverser';
// import { Direction } from "../types"

describe('Json Traverser', () => {
  it('traverses flat object', () => {
    const jsonObject = {
      prop1: 'value1',
      prop2: 123,
      prop3: null,
      prop4: true,
      prop5: {},
      prop6: [],
    };
    let node;
    const traverser = new JsonTraverser(jsonObject);
    node = traverser.next();
    expect(node).toEqual({
      ref: { tagName: 'prop1', value: 'value1' },
      root: {
        ref: { tagName: 'prop1', value: 'value1' },
      },
    });
    node = traverser.next();
    expect(node).toEqual({
      ref: { tagName: 'prop2', value: 123 },
      root: {
        ref: { tagName: 'prop2', value: 123 },
      },
    });
    node = traverser.next();
    expect(node).toEqual({
      ref: { tagName: 'prop3', value: null },
      root: {
        ref: { tagName: 'prop3', value: null },
      },
    });
    node = traverser.next();
    expect(node).toEqual({
      ref: { tagName: 'prop4', value: true },
      root: {
        ref: { tagName: 'prop4', value: true },
      },
    });
    node = traverser.next();
    expect(node).toEqual({
      ref: { tagName: 'prop5', value: {} },
      root: {
        ref: { tagName: 'prop5', value: {} },
      },
    });
    node = traverser.next();
    expect(node).toEqual({
      ref: { tagName: 'prop6', value: [] },
      root: {
        ref: { tagName: 'prop6', value: [] },
      },
    });
    node = traverser.next();
    expect(node).toBeNull();
  });

  it('traverses array', () => {
    const firstElementRef = {
      tagName: '[]',
      value: {
        prop1: 'value1',
        prop2: 123,
        prop3: null,
      },
    };
    const secondElementRef = {
      tagName: '[]',
      value: {
        prop4: true,
        prop5: {},
        prop6: [],
      },
    };
    const jsonObject = [firstElementRef.value, secondElementRef.value];

    let node;
    const traverser = new JsonTraverser(jsonObject);
    node = traverser.next();
    expect(node).toEqual({
      ref: firstElementRef,
      root: {
        ref: firstElementRef,
      },
    });
    node = traverser.next();
    expect(node).toEqual({
      ref: {
        tagName: 'prop1',
        value: 'value1',
      },
      root: {
        ref: firstElementRef,
        child: {
          ref: {
            tagName: 'prop1',
            value: 'value1',
          },
        },
      },
    });
    node = traverser.next();
    expect(node).toEqual({
      ref: {
        tagName: 'prop2',
        value: 123,
      },
      root: {
        ref: firstElementRef,
        child: {
          ref: {
            tagName: 'prop2',
            value: 123,
          },
        },
      },
    });
    node = traverser.next();
    expect(node).toEqual({
      ref: {
        tagName: 'prop3',
        value: null,
      },
      root: {
        ref: firstElementRef,
        child: {
          ref: {
            tagName: 'prop3',
            value: null,
          },
        },
      },
    });
    node = traverser.next();
    expect(node).toEqual({
      ref: secondElementRef,
      root: {
        ref: secondElementRef,
      },
    });
    node = traverser.next();
    expect(node).toEqual({
      ref: {
        tagName: 'prop4',
        value: true,
      },
      root: {
        ref: secondElementRef,
        child: {
          ref: {
            tagName: 'prop4',
            value: true,
          },
        },
      },
    });
    node = traverser.next();
    expect(node).toEqual({
      ref: {
        tagName: 'prop5',
        value: {},
      },
      root: {
        ref: secondElementRef,
        child: {
          ref: {
            tagName: 'prop5',
            value: {},
          },
        },
      },
    });
    node = traverser.next();
    expect(node).toEqual({
      ref: {
        tagName: 'prop6',
        value: [],
      },
      root: {
        ref: secondElementRef,
        child: {
          ref: {
            tagName: 'prop6',
            value: [],
          },
        },
      },
    });
    node = traverser.next();
    expect(node).toBeNull();
  });

  it('traverses nested object', () => {
    const parentProp2 = {
      tagName: 'parentProp2',
      value: {
        prop1: 'value1',
      },
    };
    const parentProp1 = {
      tagName: 'parentProp1',
      value: {
        parentProp2: parentProp2.value,
        prop2: null,
      },
    };
    const parentProp4 = {
      tagName: 'parentProp4',
      value: {
        prop4: [],
      },
    };
    const parentProp3 = {
      tagName: 'parentProp3',
      value: {
        prop3: {},
        parentProp4: parentProp4.value,
      },
    };
    const jsonObject = {
      parentProp1: parentProp1.value,
      parentProp3: parentProp3.value,
    };
    let node;
    const traverser = new JsonTraverser(jsonObject);
    node = traverser.next();
    expect(node).toEqual({
      ref: parentProp1,
      root: {
        ref: parentProp1,
      },
    });
    node = traverser.next();
    expect(node).toEqual({
      ref: parentProp2,
      root: {
        ref: parentProp1,
        child: {
          ref: parentProp2,
        },
      },
    });
    node = traverser.next();
    expect(node).toEqual({
      ref: { tagName: 'prop1', value: 'value1' },
      root: {
        ref: parentProp1,
        child: {
          ref: parentProp2,
          child: {
            ref: { tagName: 'prop1', value: 'value1' },
          },
        },
      },
    });
    node = traverser.next();
    expect(node).toEqual({
      ref: { tagName: 'prop2', value: null },
      root: {
        ref: parentProp1,
        child: {
          ref: { tagName: 'prop2', value: null },
        },
      },
    });
    node = traverser.next();
    expect(node).toEqual({
      ref: parentProp3,
      root: {
        ref: parentProp3,
      },
    });
    node = traverser.next();
    expect(node).toEqual({
      ref: { tagName: 'prop3', value: {} },
      root: {
        ref: parentProp3,
        child: {
          ref: { tagName: 'prop3', value: {} },
        },
      },
    });
    node = traverser.next();
    expect(node).toEqual({
      ref: parentProp4,
      root: {
        ref: parentProp3,
        child: {
          ref: parentProp4,
        },
      },
    });
    node = traverser.next();
    expect(node).toEqual({
      ref: { tagName: 'prop4', value: [] },
      root: {
        ref: parentProp3,
        child: {
          ref: parentProp4,
          child: {
            ref: { tagName: 'prop4', value: [] },
          },
        },
      },
    });
    node = traverser.next();
    expect(node).toBeNull();
  });

  it('traverses nested array and objects', () => {
    const parentProp2 = {
      tagName: 'parentProp2',
      value: {
        prop1: 'value1',
      },
    };
    const element_1_1 = {
      tagName: '[]',
      value: {
        parentProp2: parentProp2.value,
        prop2: 123,
      },
    };
    const element_1_2 = {
      tagName: '[]',
      value: {
        prop3: null,
      },
    };
    const element_1 = {
      tagName: '[]',
      value: [element_1_1.value, element_1_2.value],
    };
    const element_2 = {
      tagName: '[]',
      value: ['valueX'],
    };
    const parentProp1 = {
      tagName: 'parentProp1',
      value: [element_1.value, element_2.value],
    };
    const parentProp3 = {
      tagName: 'parentProp3',
      value: {
        prop4: true,
      },
    };
    const jsonObject = {
      parentProp1: parentProp1.value,
      parentProp3: parentProp3.value,
    };
    // const jsonObject = {
    //     'parentProp1': [
    //         [
    //             {
    //                 'parentProp2': {
    //                     'prop1': 'value1'
    //                 },
    //                 'prop2': 123
    //             },
    //             {
    //                 'prop3': null
    //             }
    //         ],
    //         [
    //             'valueX'
    //         ]
    //     ],
    //     'parentProp3': {
    //         'prop4': true
    //     }
    // }
    let node;
    const traverser = new JsonTraverser(jsonObject);
    node = traverser.next();
    expect(node).toEqual({
      ref: parentProp1,
      root: {
        ref: parentProp1,
      },
    });
    node = traverser.next();
    expect(node).toEqual({
      ref: element_1,
      root: {
        ref: parentProp1,
        child: {
          ref: element_1,
        },
      },
    });
    node = traverser.next();
    expect(node).toEqual({
      ref: element_1_1,
      root: {
        ref: parentProp1,
        child: {
          ref: element_1,
          child: {
            ref: element_1_1,
          },
        },
      },
    });
    node = traverser.next();
    expect(node).toEqual({
      ref: parentProp2,
      root: {
        ref: parentProp1,
        child: {
          ref: element_1,
          child: {
            ref: element_1_1,
            child: {
              ref: parentProp2,
            },
          },
        },
      },
    });
    node = traverser.next();
    expect(node).toEqual({
      ref: { tagName: 'prop1', value: 'value1' },
      root: {
        ref: parentProp1,
        child: {
          ref: element_1,
          child: {
            ref: element_1_1,
            child: {
              ref: parentProp2,
              child: {
                ref: { tagName: 'prop1', value: 'value1' },
              },
            },
          },
        },
      },
    });
    node = traverser.next();
    expect(node).toEqual({
      ref: { tagName: 'prop2', value: 123 },
      root: {
        ref: parentProp1,
        child: {
          ref: element_1,
          child: {
            ref: element_1_1,
            child: {
              ref: { tagName: 'prop2', value: 123 },
            },
          },
        },
      },
    });
    node = traverser.next();
    expect(node).toEqual({
      ref: element_1_2,
      root: {
        ref: parentProp1,
        child: {
          ref: element_1,
          child: {
            ref: element_1_2,
          },
        },
      },
    });
    node = traverser.next();
    expect(node).toEqual({
      ref: { tagName: 'prop3', value: null },
      root: {
        ref: parentProp1,
        child: {
          ref: element_1,
          child: {
            ref: element_1_2,
            child: {
              ref: { tagName: 'prop3', value: null },
            },
          },
        },
      },
    });
    node = traverser.next();
    expect(node).toEqual({
      ref: element_2,
      root: {
        ref: parentProp1,
        child: {
          ref: element_2,
        },
      },
    });
    node = traverser.next();
    expect(node).toEqual({
      ref: { tagName: '[]', value: 'valueX' },
      root: {
        ref: parentProp1,
        child: {
          ref: element_2,
          child: {
            ref: { tagName: '[]', value: 'valueX' },
          },
        },
      },
    });
    node = traverser.next();
    expect(node).toEqual({
      ref: parentProp3,
      root: {
        ref: parentProp3,
      },
    });
    node = traverser.next();
    expect(node).toEqual({
      ref: { tagName: 'prop4', value: true },
      root: {
        ref: parentProp3,
        child: {
          ref: { tagName: 'prop4', value: true },
        },
      },
    });
    node = traverser.next();
    expect(node).toBeNull();
  });
});
