import { govABI } from './govAbi';
import { treasuryABI } from './treasuryABI';
import { BuilderRegistryAbi } from './builderRegistryAbi';
import { EarlyAdoptersNFTAbi } from './earlyAdoptersNFTAbi';
import { stRifABI } from './stRifAbi';
import { rifABI } from './rifAbi';
import { SimplifiedRewardDistributorAbi } from './simplifiedRewardAbi';
import { RewardDistributorAbi } from './rewardDistributionAbi';

export const supportedAbis = () => {
  return [
    EarlyAdoptersNFTAbi,
    govABI,
    treasuryABI,
    BuilderRegistryAbi,
    stRifABI,
    rifABI,
    SimplifiedRewardDistributorAbi,
    RewardDistributorAbi
  ];
};
