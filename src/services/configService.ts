class ConfigService {
  private config: {
    depositAddress: string;
    maintenanceMode: boolean;
  } = {
    depositAddress: '',
    maintenanceMode: false,
  };

  getDepositAddress(): string {
    return this.config.depositAddress;
  }

  setDepositAddress(address: string): void {
    this.config.depositAddress = address;
  }

  isMaintenanceMode(): boolean {
    return this.config.maintenanceMode;
  }

  setMaintenanceMode(enabled: boolean): void {
    this.config.maintenanceMode = enabled;
  }
}

export const configService = new ConfigService();
