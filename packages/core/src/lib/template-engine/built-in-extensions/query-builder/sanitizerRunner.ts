import {
  FilterRunner,
  FilterRunnerTransformOptions,
  VulcanInternalExtension,
} from '@vulcan-sql/core/models';
import { PARAMETERIZER_VAR_NAME, SANITIZER_NAME } from './constants';
import { TemplateInput } from './templateInput';

@VulcanInternalExtension()
export class SanitizerRunner extends FilterRunner {
  public filterName = SANITIZER_NAME;

  public async transform({
    value,
    context,
  }: FilterRunnerTransformOptions): Promise<any> {
    let input: TemplateInput;
    // Wrap the value to template input to parameterized
    if (value instanceof TemplateInput) input = value;
    else {
      input = new TemplateInput(value);
    }

    const parameterizer = context.lookup(PARAMETERIZER_VAR_NAME);
    if (!parameterizer) throw new Error(`No parameterizer found`);
    return await input.parameterize(parameterizer);
  }
}
