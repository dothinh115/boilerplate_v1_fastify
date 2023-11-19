type TPrev = {
  path?: string;
  populate?: any;
  select?: string;
};
export const createFieldObj = (
  fieldString: string,
): {
  selectObj: any;
  fieldSplit: TPrev[];
} => {
  let fieldHandle: any = {},
    selectObj: any;
  const fieldArr = fieldString.split(',').filter((item: string) => item !== '');
  for (const field of fieldArr) {
    if (field.includes('.')) {
      const nestedFieldArr = field
        .split('.')
        .filter((item: string) => item !== '');
      selectObj = {
        ...selectObj,
        [nestedFieldArr[0]]: 1,
      };
      const removeLastEl = nestedFieldArr.slice(0, -1).join('.');
      const lastEl = nestedFieldArr.slice(-1).join();
      if (!fieldHandle[removeLastEl])
        fieldHandle = {
          ...fieldHandle,
          [removeLastEl]: lastEl,
        };
      else {
        if (!fieldHandle[removeLastEl].includes('*'))
          fieldHandle[removeLastEl] = fieldHandle[removeLastEl] + ' ' + lastEl;
      }
    } else
      selectObj = {
        ...selectObj,
        [field]: 1,
      };
  }
  let fieldSplit: TPrev[] = [];
  for (const [key, value] of Object.entries(fieldHandle)) {
    const keySplit = key.split('.').filter((item: string) => item !== '');
    let populateObj: TPrev;
    if (keySplit.length > 1) {
      populateObj = keySplit.reduceRight(
        (prev: TPrev, cur: string, index) => {
          return {
            path: cur,
            ...(index + 1 === keySplit.length
              ? {
                  ...(value !== '*' && {
                    select: value as string,
                  }),
                }
              : { populate: prev }),
          };
        },
        { populate: {} },
      );
    } else {
      populateObj = {
        path: key,
        ...(value !== '*' && {
          select: value as string,
        }),
      };
    }
    fieldSplit = [...fieldSplit, populateObj];
  }
  for (const index in fieldSplit) {
    const filterfieldSplit = fieldSplit.filter(
      (item: { path: string }) => item.path === fieldSplit[index]?.path,
    );
    if (filterfieldSplit.length > 1) {
      const newObj = {
        ...fieldSplit[index],
        ...filterfieldSplit[1],
      };
      fieldSplit = [
        ...fieldSplit.filter(
          (item: { path: string }) => item.path !== fieldSplit[index].path,
        ),
        { ...newObj },
      ];
    }
  }
  for (const field of fieldArr) {
    if (field === '*') {
      selectObj = undefined;
      break;
    }
  }
  for (const item of fieldSplit) {
    if (item['select']?.includes('*')) delete item['select'];
  }
  return {
    selectObj,
    fieldSplit,
  };
};
