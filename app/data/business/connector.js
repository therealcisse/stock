import { BUSINESS_KEY } from 'vars';

import Loaders from './loaders';

export class BusinessConnector {
  constructor({ db }) {
    this.db = db;
    this.loaders = Loaders({ db });
  }

  updateBusiness(
    {
      displayName,
      url,
      country,
      city,
      address,
      postalCode,
      phone,
      fax,
      email,
      taxId,
      rc,
      ice,
      cnss,
      patente,
    },
    { Business, Now },
  ) {
    this.loaders.business.clear(BUSINESS_KEY);

    this.db
      .prepare(
        `UPDATE business SET
           displayName = @displayName,
           url = @url,
           country = @country,
           city = @city,
           address = @address,
           postalCode = @postalCode,
           phone = @phone,
           fax = @fax,
           email = @email,
           taxId = @taxId,
           rc = @rc,
           ice = @ice,
           cnss = @cnss,
           patente = @patente,
           lastModified = @lastModified
         WHERE key = @id;`,
      )
      .run({
        displayName,
        url,
        country,
        city,
        address,
        postalCode,
        phone,
        fax,
        email,
        taxId,
        rc,
        ice,
        cnss,
        patente,
        lastModified: Now(),
        id: BUSINESS_KEY,
      });

    return Business.get();
  }

  get() {
    return this.loaders.business.load(BUSINESS_KEY);
  }
}
