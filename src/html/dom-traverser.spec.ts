import DomTraverser from './dom-traverser';
import { TraverseNode } from '../types';

describe('Dom Traverser', () => {
  let htmlString;
  beforeAll(() => {
    htmlString = `
        <html>
            <body>
                <div class="container">
                    <div class="header">
                        <nav>
                            <ul>
                                <li>
                                    Menu1
                                </li>
                                <li>
                                    Menu2
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <div class="main">
                        <div id="articleX" class="article">
                            <p>
                                Sample paragraph 1
                            </p>
                            <p>
                                Sample paragraph 1 <b>bold text</b> normal text
                            </p>
                            <div>
                                <img src="/image.jpeg" alt="Image Text">
                            </div>
                        </div>
                    </div>
                    <div class="footer">
                        Copyright
                        <span>2020</span>
                    </div>
                </div>
            </body>
        </html>
        `;
  });

  it('traverses children', () => {
    const traverser = new DomTraverser(htmlString);
    let node: TraverseNode;
    node = traverser.next();
    expect(node.ref.tagName).toEqual('html');
    expect(node.ref.classList).toBeUndefined();
    expect(node.ref.id).toBeUndefined();

    node = traverser.next(); // head
    node = traverser.next(true); // body
    node = traverser.next(); // div
    node = traverser.next(); // div.container
    node = traverser.next(); // div.header
    node = traverser.next(true); // div.main
    node = traverser.next(); // div.article

    expect(node.ref.tagName).toEqual('div');
    expect(node.ref.classList).toEqual(['article']);
    expect(node.ref.id).toEqual('articleX');

    node = traverser.next(); // p
    node = traverser.next(); // p
    node = traverser.next(); // b
    node = traverser.next(); // div
    node = traverser.next(); // img

    expect(node.ref.tagName).toEqual('img');
    expect(node.ref.classList).toBeUndefined();
    expect(node.ref.id).toBeUndefined();

    node = traverser.next(); // div.footer

    expect(node.ref.tagName).toEqual('div');
    expect(node.ref.classList).toEqual(['footer']);
    expect(node.ref.id).toBeUndefined();

    node = traverser.next(); // span
    node = traverser.next(); // end of traverse
    expect(node).toBeNull();
  });

  it('traverses children with their parents', () => {
    const traverser = new DomTraverser(htmlString);
    let node: TraverseNode;
    let child: TraverseNode;
    node = traverser.next(); // html
    node = traverser.next(); // head
    node = traverser.next(true); // body
    node = traverser.next(); // div
    node = traverser.next(); // div.container
    node = traverser.next(); // div.header
    node = traverser.next(true); // div.main
    node = traverser.next(); // div.article

    child = node.root;
    expect(child.ref.tagName).toEqual('html');
    expect(child.ref.classList).toBeUndefined();
    expect(child.ref.id).toBeUndefined();
    child = child.child;
    expect(child.ref.tagName).toEqual('body');
    expect(child.ref.classList).toBeUndefined();
    expect(child.ref.id).toBeUndefined();
    child = child.child;
    expect(child.ref.tagName).toEqual('div');
    expect(child.ref.classList).toEqual(['container']);
    expect(child.ref.id).toBeUndefined();
    child = child.child;
    expect(child.ref.tagName).toEqual('div');
    expect(child.ref.classList).toEqual(['main']);
    expect(child.ref.id).toBeUndefined();
    child = child.child;
    expect(child.ref.tagName).toEqual('div');
    expect(child.ref.classList).toEqual(['article']);
    expect(child.ref.id).toEqual('articleX');
    child = child.child;
    expect(child).toBeUndefined();

    node = traverser.next(); // p
    node = traverser.next(); // p
    node = traverser.next(); // b
    node = traverser.next(); // div
    node = traverser.next(); // img

    child = node.root;
    expect(child.ref.tagName).toEqual('html');
    expect(child.ref.classList).toBeUndefined();
    expect(child.ref.id).toBeUndefined();
    child = child.child;
    expect(child.ref.tagName).toEqual('body');
    expect(child.ref.classList).toBeUndefined();
    expect(child.ref.id).toBeUndefined();
    child = child.child;
    expect(child.ref.tagName).toEqual('div');
    expect(child.ref.classList).toEqual(['container']);
    expect(child.ref.id).toBeUndefined();
    child = child.child;
    expect(child.ref.tagName).toEqual('div');
    expect(child.ref.classList).toEqual(['main']);
    expect(child.ref.id).toBeUndefined();
    child = child.child;
    expect(child.ref.tagName).toEqual('div');
    expect(child.ref.classList).toEqual(['article']);
    expect(child.ref.id).toEqual('articleX');
    child = child.child;
    expect(child.ref.tagName).toEqual('div');
    expect(child.ref.classList).toBeUndefined();
    expect(child.ref.id).toBeUndefined();
    child = child.child;
    expect(child.ref.tagName).toEqual('img');
    expect(child.ref.classList).toBeUndefined();
    expect(child.ref.id).toBeUndefined();
    child = child.child;
    expect(child).toBeUndefined();

    node = traverser.next(); // div.footer

    child = node.root;
    expect(child.ref.tagName).toEqual('html');
    expect(child.ref.classList).toBeUndefined();
    expect(child.ref.id).toBeUndefined();
    child = child.child;
    expect(child.ref.tagName).toEqual('body');
    expect(child.ref.classList).toBeUndefined();
    expect(child.ref.id).toBeUndefined();
    child = child.child;
    expect(child.ref.tagName).toEqual('div');
    expect(child.ref.classList).toEqual(['container']);
    expect(child.ref.id).toBeUndefined();
    child = child.child;
    expect(child.ref.tagName).toEqual('div');
    expect(child.ref.classList).toEqual(['footer']);
    expect(child.ref.id).toBeUndefined();
    child = child.child;
    expect(child).toBeUndefined();

    node = traverser.next(); // span
    node = traverser.next(); // end of traverse
    expect(node).toBeNull();
  });
});
