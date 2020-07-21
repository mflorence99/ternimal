import { StateOperator } from '@ngxs/store';

/**
 * Common state operators
 *
 * @see https://medium.com/ngxs/ngxs-state-operators-8b339641b220
 */

export function scratch(...keys: string[]): StateOperator<any> {
  return (state: any): any => {
    if (!keys.some(key => !!state[key]))
      return state;
    else return keys.reduce((acc, key) => {
      delete acc[key];
      return acc;
    }, { ...state });
  };
}
