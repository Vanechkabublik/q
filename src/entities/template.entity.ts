// template.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from './category.entity';

@Entity('templates')
export class Template {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('text')
    prompt: string;

    @Column({ nullable: true })
    preview_url: string;

    @Column()
    category_id: number;

    @ManyToOne(() => Category, category => category.templates)
    @JoinColumn({ name: 'category_id' })
    category: Category;
}