import { TraverseNode, CompareResult, Selector } from './types';
import SelectorComparer from './selector-comparer';

describe('Selector Comparer', () => {
  let comparer: SelectorComparer;

  beforeAll(() => {
    comparer = new SelectorComparer();
  });

  it('returns not equal when the compared paths have not equal node', () => {
    const currentNode: TraverseNode = {
      ref: { tagName: 'path3' },
      root: {
        ref: { tagName: 'path1' },
        child: {
          ref: { tagName: 'path2' },
          child: {
            ref: { tagName: '[]' },
            child: {
              ref: { tagName: '[]' },
              child: {
                ref: { tagName: 'path3' },
              },
            },
          },
        },
      },
    }; //'path1.path2[][].path3'
    const pathToCompare: Selector[] = [
      { tag: 'path1', isChild: true },
      { tag: 'path2', isChild: true },
      { tag: '[]', isChild: true },
      { tag: 'path3', isChild: true },
    ]; // 'path1.path2[].path3'

    const result = comparer.compare(currentNode, pathToCompare);

    expect(result).toBe(CompareResult.NotEqual);
  });

  it('returns equal when the compared paths have exactly same nodes', () => {
    const currentNode: TraverseNode = {
      ref: { tagName: 'path3' },
      root: {
        ref: { tagName: 'path1' },
        child: {
          ref: { tagName: 'path2' },
          child: {
            ref: { tagName: '[]' },
            child: {
              ref: { tagName: '[]' },
              child: {
                ref: { tagName: 'path3' },
              },
            },
          },
        },
      },
    }; // 'path1.path2[][].path3'
    const pathToCompare: Selector[] = [
      { tag: 'path1', isChild: true },
      { tag: 'path2', isChild: true },
      { tag: '[]', isChild: true },
      { tag: '[]', isChild: true },
      { tag: 'path3', isChild: true },
    ]; // 'path1.path2[][].path3'

    const result = comparer.compare(currentNode, pathToCompare);

    expect(result).toBe(CompareResult.Equal);
  });

  it('returns parent when the current path has less nodes', () => {
    const currentNode: TraverseNode = {
      ref: { tagName: 'path3' },
      root: {
        ref: { tagName: 'path1' },
        child: {
          ref: { tagName: 'path2' },
          child: {
            ref: { tagName: '[]' },
          },
        },
      },
    }; // 'path1.path2[]'
    const pathToCompare: Selector[] = [
      { tag: 'path1', isChild: true },
      { tag: 'path2', isChild: true },
      { tag: '[]', isChild: true },
      { tag: '[]', isChild: true },
      { tag: 'path3', isChild: true },
    ]; // 'path1.path2[][].path3'

    const result = comparer.compare(currentNode, pathToCompare);

    expect(result).toBe(CompareResult.Parent);
  });

  it('returns child when the current path has more nodes', () => {
    const currentNode: TraverseNode = {
      ref: { tagName: 'path3' },
      root: {
        ref: { tagName: 'path1' },
        child: {
          ref: { tagName: 'path2' },
          child: {
            ref: { tagName: '[]' },
            child: {
              ref: { tagName: '[]' },
              child: {
                ref: { tagName: 'path3' },
                child: {
                  ref: { tagName: '[]' },
                },
              },
            },
          },
        },
      },
    }; // 'path1.path2[][].path3[]'
    const pathToCompare: Selector[] = [
      { tag: 'path1', isChild: true },
      { tag: 'path2', isChild: true },
      { tag: '[]', isChild: true },
      { tag: '[]', isChild: true },
      { tag: 'path3', isChild: true },
    ]; // 'path1.path2[][].path3'

    const result = comparer.compare(currentNode, pathToCompare);

    expect(result).toBe(CompareResult.Child);
  });
});
