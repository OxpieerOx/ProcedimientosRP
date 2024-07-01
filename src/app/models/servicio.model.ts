export class Servicio {
    serviceId: number;
    serviceName: string;
    serviceDescription: string;

    constructor(options?: Partial<Servicio>) {
        this.serviceId = options?.serviceId || 0;
        this.serviceName = options?.serviceName || '';
        this.serviceDescription = options?.serviceDescription || '';
    }
}