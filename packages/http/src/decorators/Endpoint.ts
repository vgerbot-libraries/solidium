import {
    EndpointMetadata,
    EndpointOptions
} from '../metadata/EndpointMetadata';

export function Endpoint(options: EndpointOptions): ClassDecorator {
    return (target: Function) => {
        EndpointMetadata.from(target).setOptions(options);
    };
}
