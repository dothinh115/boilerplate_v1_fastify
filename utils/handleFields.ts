export const createFieldObj = (fieldString: string) => {
  //Bóc tách lấy các field cần
  let fieldHandle: any = {},
    selectObj: any;
  const fieldArr = fieldString.split(',').filter((item: string) => item !== '');
  // ['author.slug','author.title'];
  for (const field of fieldArr) {
    //author.slug.a, author.slug.b
    if (field.includes('.')) {
      const nestedFieldArr = field
        .split('.')
        .filter((item: string) => item !== ''); //['author', 'slug', 'a']
      selectObj = {
        ...selectObj,
        [nestedFieldArr[0]]: 1,
      };

      const removeLastEl = nestedFieldArr.slice(0, -1).join('.'); //author.slug
      const lastEl = nestedFieldArr.slice(-1).join(); //a
      /*
        {
          'author': 'a b',
          'author.category':'c d'
        }
      */
      if (!fieldHandle[removeLastEl])
        //fieldHandle['author.slug']
        fieldHandle = {
          ...fieldHandle,
          [removeLastEl]: lastEl,
        };
      else fieldHandle[removeLastEl] = fieldHandle[removeLastEl] + ' ' + lastEl; //'author.slug': 'a b'
    } else
      selectObj = {
        ...selectObj,
        [field]: 1,
      };
  }
  let fieldSplit: any[] = [];
  for (const [key, value] of Object.entries(fieldHandle)) {
    //key: 'author.category' ---- value: 'c d'
    const keySplit = key.split('.').filter((item: string) => item !== ''); //['author','category']
    let populateObj: any;
    type TPrev = {
      path?: string;
      populate?: any;
      select?: string;
    };
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
          select: value,
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
  return {
    selectObj,
    fieldSplit,
  };
};
