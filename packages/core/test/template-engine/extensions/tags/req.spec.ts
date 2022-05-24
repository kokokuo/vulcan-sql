import { TYPES } from '@vulcan/core/containers';
import {
  NunjucksCompiler,
  InMemoryCodeLoader,
  Executor,
  ReqExtension,
  Compiler,
  QueryBuilder,
  ExecuteExtension,
} from '@vulcan/core/template-engine';
import { Container } from 'inversify';
import * as sinon from 'ts-sinon';

let container: Container;
let mockExecutor: sinon.StubbedInstance<Executor>;
let mockBuilder: sinon.StubbedInstance<QueryBuilder>;

beforeEach(() => {
  container = new Container();
  mockBuilder = sinon.stubInterface<QueryBuilder>();
  mockBuilder.value.resolves([{ count: 1 }]);
  mockExecutor = sinon.stubInterface<Executor>();
  mockExecutor.createBuilder.resolves(mockBuilder);
  container
    .bind(TYPES.CompilerLoader)
    .to(InMemoryCodeLoader)
    .inSingletonScope();
  container.bind(TYPES.Executor).toConstantValue(mockExecutor);
  container.bind(TYPES.Compiler).to(NunjucksCompiler).inSingletonScope();
  container.bind(TYPES.CompilerExtension).to(ReqExtension).inSingletonScope();
  container
    .bind(TYPES.CompilerExtension)
    .to(ExecuteExtension)
    .inSingletonScope();
});

afterEach(() => {
  container.unbindAll();
});

it('req extension should execute correct query and set variable', async () => {
  // Arrange
  const compiler = container.get<Compiler>(TYPES.Compiler);
  const loader = container.get<InMemoryCodeLoader>(TYPES.CompilerLoader);
  const { compiledData } = compiler.compile(`
{% req userCount %}
select count(*) as count from user where user.id = '{{ params.userId }}';
{% endreq %}
{{ userCount.value()[0].count }}
  `);

  // Action
  loader.setSource('test', compiledData);
  const query = await compiler.render('test', {
    params: { userId: 'user-id' },
  });
  // Assert
  expect(mockExecutor.createBuilder.firstCall.args[0]).toBe(
    `select count(*) as count from user where user.id = 'user-id';`
  );
  expect(query).toBe('1');
});

it('if argument is not a symbol, extension should throw', async () => {
  // Arrange
  const compiler = container.get<Compiler>(TYPES.Compiler);

  // Action, Assert
  expect(() =>
    compiler.compile(`
{% req "userCount" %}
select count(*) as count from user where user.id = '{{ params.userId }}';
{% endreq %}
  `)
  ).toThrow(`Expected a symbol, but got Literal`);
});

it('if argument is missing, extension should throw', async () => {
  // Arrange
  const compiler = container.get<Compiler>(TYPES.Compiler);

  // Action, Assert
  expect(() =>
    compiler.compile(`
{% req %}
select count(*) as count from user where user.id = '{{ params.userId }}';
{% endreq %}
  `)
  ).toThrow(`Expected a variable`);
});
