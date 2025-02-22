export interface BaseDAO<T, CreateDTO, UpdateDTO> {
  create(data: CreateDTO): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  update(id: string, data: UpdateDTO): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}
