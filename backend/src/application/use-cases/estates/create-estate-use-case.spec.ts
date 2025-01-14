import { faker } from '@faker-js/faker';
import { Test } from '@nestjs/testing';

import { Estate } from '@domain/entities/estate';

import { AgencyRepository } from '@infra/database/repositories/agency.repository';
import { EstateRepository } from '@infra/database/repositories/estate.repository';
import { EstateFeatureRepository } from '@infra/database/repositories/estateFeature.repository';
import { EstateTypeRepository } from '@infra/database/repositories/estateType.repository';
import { FeatureRepository } from '@infra/database/repositories/feature.repository';
import { FeatureCategoryRepository } from '@infra/database/repositories/featureCategory.repository';
import { PriceType } from '@infra/http/rest/dto/enum/price';

import { InMemoryAgencyRepository } from '@test/repositories/in-memory-agency.repository';
import { InMemoryEstateRepository } from '@test/repositories/in-memory-estate.repository';
import { InMemoryEstateFeatureRepository } from '@test/repositories/in-memory-estateFeature.repository';
import { InMemoryEstateTypeRepository } from '@test/repositories/in-memory-estateType.repository';
import { InMemoryFeatureRepository } from '@test/repositories/in-memory-feature.repository';
import { InMemoryFeatureCategoryRepository } from '@test/repositories/in-memory-featureCategory.repository';

import { CreateEstateUseCase } from './create-estate-use-case';

describe('Create Estate UseCase', () => {
  let createEstateUseCase: CreateEstateUseCase;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: EstateRepository,
          useClass: InMemoryEstateRepository,
        },
        {
          provide: AgencyRepository,
          useClass: InMemoryAgencyRepository,
        },
        {
          provide: EstateTypeRepository,
          useClass: InMemoryEstateTypeRepository,
        },
        {
          provide: FeatureRepository,
          useClass: InMemoryFeatureRepository,
        },
        {
          provide: EstateFeatureRepository,
          useClass: InMemoryEstateFeatureRepository,
        },
        {
          provide: FeatureCategoryRepository,
          useClass: InMemoryFeatureCategoryRepository,
        },
        CreateEstateUseCase,
      ],
    }).compile();

    createEstateUseCase = moduleRef.get(CreateEstateUseCase);
  });

  it('should be able to create a Estate', async () => {
    const response = await createEstateUseCase.handle({
      name: 'Estate Example',
      description: 'Description example',
      address: {
        city: 'City example',
        number: 123,
        state: 'State example',
        street: 'Street example',
        zip: '12345678',
      },
      prices: [
        { value: 123, type: PriceType.RENT },
        { value: 123, type: PriceType.SALE },
      ],
      agency: { connect: { id: faker.string.uuid() } },
      type: { connect: { id: faker.string.uuid() } },
      features: [
        {
          amount: 1,
          featureId: faker.string.uuid(),
          showAmount: true,
        },
      ],
    });

    expect(response).not.toBeNull();
    expect(response).toBeInstanceOf(Estate);
  });
});
