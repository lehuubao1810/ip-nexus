# List IP Assets

> Retrieve a list of IP assets with pagination and filtering options. The 'where' field is optional and should only be provided when filtering by specific IP IDs, owner address, or token contract address. This endpoint can also be used to fetch a single asset by passing its ID in the ipIds filter.

## OpenAPI

````yaml https://api.storyapis.com/api/v4/openapi.json post /assets
paths:
  path: /assets
  method: post
  servers:
    - url: https://api.storyapis.com/api/v4
    - url: https://staging-api.storyprotocol.net/api/v4
    - url: http://localhost:8080/api/v4
      description: Local development server
  request:
    security:
      - title: ApiKeyAuth
        parameters:
          query: {}
          header:
            X-Api-Key:
              type: apiKey
          cookie: {}
    parameters:
      path: {}
      query: {}
      header: {}
      cookie: {}
    body:
      application/json:
        schemaArray:
          - type: object
            properties:
              includeLicenses:
                allOf:
                  - description: Include license information in response
                    examples:
                      - false
                    type: boolean
              moderated:
                allOf:
                  - description: Filter for moderated content only
                    examples:
                      - false
                    type: boolean
              orderBy:
                allOf:
                  - default: blockNumber
                    description: Field to order results by
                    enum:
                      - descendantCount
                      - blockNumber
                      - createdAt
                    type: string
              orderDirection:
                allOf:
                  - default: desc
                    description: Order direction for results
                    enum:
                      - asc
                      - desc
                    type: string
              pagination:
                allOf:
                  - $ref: '#/components/schemas/PaginationOptionsHuma'
                    description: Pagination configuration
              where:
                allOf:
                  - $ref: '#/components/schemas/IPAssetsWhereOptionsHuma'
                    description: Optional filter options for IP assets
            required: true
            refIdentifier: '#/components/schemas/IPAssetsRequestBodyHuma'
            additionalProperties: false
        examples:
          example:
            value:
              includeLicenses: false
              moderated: false
              orderBy: blockNumber
              orderDirection: desc
              pagination:
                limit: 20
                offset: 0
              where:
                ipIds:
                  - <string>
                ownerAddress: <string>
                tokenContract: <string>
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              $schema:
                allOf:
                  - description: A URL to the JSON Schema for this object.
                    examples:
                      - >-
                        https://api.storyapis.com/api/v4/IPAssetsResponseHumaBody.json
                    format: uri
                    readOnly: true
                    type: string
              data:
                allOf:
                  - description: List of enriched IP assets
                    items:
                      $ref: '#/components/schemas/EnrichedIPAsset'
                    type:
                      - array
                      - 'null'
              pagination:
                allOf:
                  - $ref: '#/components/schemas/PaginationMetadataHuma'
                    description: Pagination metadata
            refIdentifier: '#/components/schemas/IPAssetsResponseHumaBody'
            requiredProperties:
              - data
            additionalProperties: false
        examples:
          example:
            value:
              $schema: https://api.storyapis.com/api/v4/IPAssetsResponseHumaBody.json
              data:
                - ancestorsCount: 123
                  blockNumber: 123
                  chainId: <string>
                  childrenCount: 123
                  createdAt: '2023-11-07T05:31:56Z'
                  descendantsCount: 123
                  description: <string>
                  infringementStatus:
                    - createdAt: '2023-11-07T05:31:56Z'
                      customData: <string>
                      infringementDetails: <string>
                      isInfringing: true
                      providerName: <string>
                      providerURL: <string>
                      responseTime: '2023-11-07T05:31:56Z'
                      status: <string>
                      updatedAt: '2023-11-07T05:31:56Z'
                  ipId: <string>
                  ipaMetadataUri: <string>
                  isInGroup: true
                  lastUpdatedAt: '2023-11-07T05:31:56Z'
                  licenses:
                    - createdAt: '2023-11-07T05:31:56Z'
                      licenseTemplateId: <string>
                      licenseTermsId: <string>
                      licensingConfig:
                        commercialRevShare: 123
                        disabled: true
                        expectGroupRewardPool: <string>
                        expectMinimumGroupRewardShare: 123
                        hookData: <string>
                        isSet: true
                        licensingHook: <string>
                        mintingFee: <string>
                      templateMetadataUri: <string>
                      templateName: <string>
                      terms:
                        commercialAttribution: true
                        commercialRevCeiling: <string>
                        commercialRevShare: 123
                        commercialUse: true
                        commercializerChecker: <string>
                        commercializerCheckerData: <string>
                        currency: <string>
                        defaultMintingFee: <string>
                        derivativeRevCeiling: <string>
                        derivativesAllowed: true
                        derivativesApproval: true
                        derivativesAttribution: true
                        derivativesReciprocal: true
                        expiration: <string>
                        royaltyPolicy: <string>
                        transferable: true
                        uri: <string>
                      updatedAt: '2023-11-07T05:31:56Z'
                  logIndex: 123
                  moderationStatus:
                    adult: <string>
                    medical: <string>
                    racy: <string>
                    spoof: <string>
                    violence: <string>
                  name: <string>
                  nftMetadata:
                    animation:
                      cachedUrl: <string>
                      contentType: <string>
                      originalUrl: <string>
                      size: 123
                    collection:
                      bannerImageUrl: <string>
                      externalUrl: <string>
                      name: <string>
                      slug: <string>
                    contract:
                      address: <string>
                      chain: <string>
                      contractDeployer: <string>
                      deployedBlockNumber: 123
                      name: <string>
                      openSeaMetadata:
                        bannerImageUrl: <string>
                        collectionName: <string>
                        collectionSlug: <string>
                        description: <string>
                        discordUrl: <string>
                        externalUrl: <string>
                        floorPrice: 123
                        imageUrl: <string>
                        lastIngestedAt: '2023-11-07T05:31:56Z'
                        safelistRequestStatus: <string>
                        twitterUsername: <string>
                      symbol: <string>
                      tokenType: <string>
                      totalSupply: <string>
                    contract_address: <string>
                    description: <string>
                    image:
                      cachedUrl: <string>
                      contentType: <string>
                      originalUrl: <string>
                      pngUrl: <string>
                      size: 123
                      thumbnailUrl: <string>
                    mint:
                      blockNumber: 123
                      mintAddress: <string>
                      timestamp: <string>
                      transactionHash: <string>
                    name: <string>
                    nft_id: <string>
                    raw: <any>
                    timeLastUpdated: '2023-11-07T05:31:56Z'
                    tokenId: <string>
                    tokenType: <string>
                    tokenUri: <string>
                  ownerAddress: <string>
                  parentsCount: 123
                  registrationDate: <string>
                  rootIPs:
                    - <string>
                  title: <string>
                  tokenContract: <string>
                  tokenId: <string>
                  txHash: <string>
                  uri: <string>
              pagination:
                hasMore: true
                limit: 123
                offset: 123
                total: 123
        description: OK
    default:
      application/problem+json:
        schemaArray:
          - type: object
            properties:
              $schema:
                allOf:
                  - description: A URL to the JSON Schema for this object.
                    examples:
                      - https://api.storyapis.com/api/v4/ErrorModel.json
                    format: uri
                    readOnly: true
                    type: string
              detail:
                allOf:
                  - description: >-
                      A human-readable explanation specific to this occurrence
                      of the problem.
                    examples:
                      - Property foo is required but is missing.
                    type: string
              errors:
                allOf:
                  - description: Optional list of individual error details
                    items:
                      $ref: '#/components/schemas/ErrorDetail'
                    type:
                      - array
                      - 'null'
              instance:
                allOf:
                  - description: >-
                      A URI reference that identifies the specific occurrence of
                      the problem.
                    examples:
                      - https://example.com/error-log/abc123
                    format: uri
                    type: string
              status:
                allOf:
                  - description: HTTP status code
                    examples:
                      - 400
                    format: int64
                    type: integer
              title:
                allOf:
                  - description: >-
                      A short, human-readable summary of the problem type. This
                      value should not change between occurrences of the error.
                    examples:
                      - Bad Request
                    type: string
              type:
                allOf:
                  - default: about:blank
                    description: >-
                      A URI reference to human-readable documentation for the
                      error.
                    examples:
                      - https://example.com/errors/example
                    format: uri
                    type: string
            refIdentifier: '#/components/schemas/ErrorModel'
            additionalProperties: false
        examples:
          example:
            value:
              $schema: https://api.storyapis.com/api/v4/ErrorModel.json
              detail: Property foo is required but is missing.
              errors:
                - location: <string>
                  message: <string>
                  value: <any>
              instance: https://example.com/error-log/abc123
              status: 400
              title: Bad Request
              type: https://example.com/errors/example
        description: Error
  deprecated: false
  type: path
components:
  schemas:
    ContractMetadata:
      additionalProperties: false
      properties:
        address:
          type: string
        chain:
          type: string
        contractDeployer:
          type: string
        deployedBlockNumber:
          format: int64
          type: integer
        name:
          type: string
        openSeaMetadata:
          $ref: '#/components/schemas/ContractMetadataOpenSeaMetadataStruct'
        symbol:
          type: string
        tokenType:
          type: string
        totalSupply:
          type: string
      required:
        - chain
        - address
        - name
        - symbol
        - totalSupply
        - tokenType
        - contractDeployer
        - deployedBlockNumber
        - openSeaMetadata
      type: object
    ContractMetadataOpenSeaMetadataStruct:
      additionalProperties: false
      properties:
        bannerImageUrl:
          type: string
        collectionName:
          type: string
        collectionSlug:
          type: string
        description:
          type: string
        discordUrl:
          type: string
        externalUrl:
          type:
            - string
            - 'null'
        floorPrice:
          format: double
          type: number
        imageUrl:
          type: string
        lastIngestedAt:
          format: date-time
          type: string
        safelistRequestStatus:
          type: string
        twitterUsername:
          type: string
      required:
        - floorPrice
        - collectionName
        - collectionSlug
        - safelistRequestStatus
        - imageUrl
        - description
        - externalUrl
        - twitterUsername
        - discordUrl
        - bannerImageUrl
        - lastIngestedAt
      type: object
    EnrichedIPAsset:
      additionalProperties: false
      properties:
        ancestorsCount:
          format: int64
          type: integer
        blockNumber:
          format: int64
          type: integer
        chainId:
          type: string
        childrenCount:
          format: int64
          type: integer
        createdAt:
          format: date-time
          type: string
        descendantsCount:
          format: int64
          type: integer
        description:
          type: string
        infringementStatus:
          items:
            $ref: '#/components/schemas/InfringementStatus'
          type:
            - array
            - 'null'
        ipId:
          type: string
        ipaMetadataUri:
          type: string
        isInGroup:
          type: boolean
        lastUpdatedAt:
          format: date-time
          type: string
        licenses:
          items:
            $ref: '#/components/schemas/License'
          type:
            - array
            - 'null'
        logIndex:
          format: int64
          type: integer
        moderationStatus:
          $ref: '#/components/schemas/ModerationStatus'
        name:
          type: string
        nftMetadata:
          $ref: '#/components/schemas/NFTMetadata'
        ownerAddress:
          type: string
        parentsCount:
          format: int64
          type: integer
        registrationDate:
          type: string
        rootIPs:
          items:
            type: string
          type:
            - array
            - 'null'
        title:
          type: string
        tokenContract:
          type: string
        tokenId:
          type: string
        txHash:
          type: string
        uri:
          type: string
      required:
        - rootIPs
        - ipId
        - ownerAddress
        - blockNumber
        - logIndex
        - txHash
        - chainId
        - tokenContract
        - tokenId
        - name
        - uri
        - registrationDate
        - lastUpdatedAt
        - createdAt
        - title
        - description
        - parentsCount
        - ancestorsCount
        - childrenCount
        - descendantsCount
        - isInGroup
      type: object
    ErrorDetail:
      additionalProperties: false
      properties:
        location:
          description: >-
            Where the error occurred, e.g. 'body.items[3].tags' or
            'path.thing-id'
          type: string
        message:
          description: Error message text
          type: string
        value:
          description: The value at the given location
      type: object
    IPAssetsWhereOptionsHuma:
      additionalProperties: false
      properties:
        ipIds:
          description: List of IP asset IDs to filter by (max 200)
          items:
            type: string
          maxItems: 200
          type:
            - array
            - 'null'
        ownerAddress:
          description: Owner wallet address to filter by
          pattern: ^0x[a-fA-F0-9]{40}$
          type: string
        tokenContract:
          description: Token contract address to filter by
          pattern: ^0x[a-fA-F0-9]{40}$
          type: string
      type: object
    InfringementStatus:
      additionalProperties: false
      properties:
        createdAt:
          format: date-time
          type: string
        customData:
          type: string
        infringementDetails:
          type: string
        isInfringing:
          type: boolean
        providerName:
          type: string
        providerURL:
          type: string
        responseTime:
          format: date-time
          type: string
        status:
          type: string
        updatedAt:
          format: date-time
          type: string
      required:
        - status
        - isInfringing
        - providerName
        - providerURL
        - infringementDetails
        - customData
        - responseTime
        - createdAt
        - updatedAt
      type: object
    License:
      additionalProperties: false
      properties:
        createdAt:
          format: date-time
          type: string
        licenseTemplateId:
          type: string
        licenseTermsId:
          type: string
        licensingConfig:
          $ref: '#/components/schemas/LicensingConfig'
        templateMetadataUri:
          type: string
        templateName:
          type: string
        terms:
          $ref: '#/components/schemas/LicenseTerms'
        updatedAt:
          format: date-time
          type: string
      required:
        - licenseTemplateId
        - licenseTermsId
        - templateName
        - templateMetadataUri
        - terms
        - licensingConfig
        - createdAt
        - updatedAt
      type: object
    LicenseTerms:
      additionalProperties: false
      properties:
        commercialAttribution:
          type: boolean
        commercialRevCeiling:
          type: string
        commercialRevShare:
          format: int64
          type: integer
        commercialUse:
          type: boolean
        commercializerChecker:
          type: string
        commercializerCheckerData:
          type: string
        currency:
          type: string
        defaultMintingFee:
          type: string
        derivativeRevCeiling:
          type: string
        derivativesAllowed:
          type: boolean
        derivativesApproval:
          type: boolean
        derivativesAttribution:
          type: boolean
        derivativesReciprocal:
          type: boolean
        expiration:
          type: string
        royaltyPolicy:
          type: string
        transferable:
          type: boolean
        uri:
          type: string
      required:
        - uri
        - currency
        - expiration
        - transferable
        - commercialUse
        - royaltyPolicy
        - defaultMintingFee
        - commercialRevShare
        - derivativesAllowed
        - derivativesApproval
        - commercialRevCeiling
        - derivativeRevCeiling
        - commercialAttribution
        - commercializerChecker
        - derivativesReciprocal
        - derivativesAttribution
        - commercializerCheckerData
      type: object
    LicensingConfig:
      additionalProperties: false
      properties:
        commercialRevShare:
          format: int64
          type: integer
        disabled:
          type: boolean
        expectGroupRewardPool:
          type: string
        expectMinimumGroupRewardShare:
          format: int64
          type: integer
        hookData:
          type: string
        isSet:
          type: boolean
        licensingHook:
          type: string
        mintingFee:
          type: string
      required:
        - isSet
        - disabled
        - hookData
        - mintingFee
        - licensingHook
        - commercialRevShare
        - expectGroupRewardPool
        - expectMinimumGroupRewardShare
      type: object
    ModerationStatus:
      additionalProperties: false
      properties:
        adult:
          type: string
        medical:
          type: string
        racy:
          type: string
        spoof:
          type: string
        violence:
          type: string
      required:
        - adult
        - spoof
        - medical
        - violence
        - racy
      type: object
    NFTMetadata:
      additionalProperties: false
      properties:
        animation:
          $ref: '#/components/schemas/NFTMetadataAnimationStruct'
        collection:
          $ref: '#/components/schemas/NFTMetadataCollectionStruct'
        contract:
          $ref: '#/components/schemas/ContractMetadata'
        contract_address:
          type: string
        description:
          type:
            - string
            - 'null'
        image:
          $ref: '#/components/schemas/NFTMetadataImageStruct'
        mint:
          $ref: '#/components/schemas/NFTMetadataMintStruct'
        name:
          type: string
        nft_id:
          type: string
        raw: {}
        timeLastUpdated:
          format: date-time
          type: string
        tokenId:
          type: string
        tokenType:
          type: string
        tokenUri:
          type: string
      required:
        - nft_id
        - contract_address
        - contract
        - tokenId
        - tokenType
        - name
        - description
        - tokenUri
        - image
        - animation
        - raw
        - collection
        - mint
        - timeLastUpdated
      type: object
    NFTMetadataAnimationStruct:
      additionalProperties: false
      properties:
        cachedUrl:
          type: string
        contentType:
          type: string
        originalUrl:
          type: string
        size:
          format: int64
          type: integer
      required:
        - cachedUrl
        - contentType
        - size
        - originalUrl
      type: object
    NFTMetadataCollectionStruct:
      additionalProperties: false
      properties:
        bannerImageUrl:
          type: string
        externalUrl:
          type:
            - string
            - 'null'
        name:
          type: string
        slug:
          type: string
      required:
        - name
        - slug
        - externalUrl
        - bannerImageUrl
      type: object
    NFTMetadataImageStruct:
      additionalProperties: false
      properties:
        cachedUrl:
          type: string
        contentType:
          type: string
        originalUrl:
          type: string
        pngUrl:
          type: string
        size:
          format: int64
          type: integer
        thumbnailUrl:
          type: string
      required:
        - cachedUrl
        - thumbnailUrl
        - pngUrl
        - contentType
        - size
        - originalUrl
      type: object
    NFTMetadataMintStruct:
      additionalProperties: false
      properties:
        blockNumber:
          format: int64
          type:
            - integer
            - 'null'
        mintAddress:
          type:
            - string
            - 'null'
        timestamp:
          type:
            - string
            - 'null'
        transactionHash:
          type:
            - string
            - 'null'
      required:
        - mintAddress
        - blockNumber
        - timestamp
        - transactionHash
      type: object
    PaginationMetadataHuma:
      additionalProperties: false
      properties:
        hasMore:
          description: Whether there are more items
          type: boolean
        limit:
          description: Current limit
          format: int64
          type: integer
        offset:
          description: Current offset
          format: int64
          type: integer
        total:
          description: Total count of items
          format: int64
          type: integer
      required:
        - offset
        - limit
        - total
        - hasMore
      type: object
    PaginationOptionsHuma:
      additionalProperties: false
      properties:
        limit:
          default: 20
          description: Number of items to return
          examples:
            - 20
          format: int64
          maximum: 200
          minimum: 1
          type: integer
        offset:
          default: 0
          description: Number of items to skip
          examples:
            - 0
          format: int64
          minimum: 0
          type: integer
      type: object

````