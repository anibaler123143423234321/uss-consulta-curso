-- Horarios reales del ciclo de enero 2027: 16 grupos del cuadro «Facilitador tiempo parcial».
-- Reemplaza SOLO las secciones de enero 2027; no toca otros ciclos ni los cursos.
-- Ejecutar en el SQL Editor de Supabase. Es una transacción: si algo falla, no cambia nada.
BEGIN;

DELETE FROM public.tbl_horarios_cursos
WHERE ciclo = 'enero' AND anio = 2027;

INSERT INTO public.tbl_horarios_cursos
  (curso_id, ciclo, anio, seccion, fecha_inicio, fecha_fin, turno, dias, hora_inicio, hora_fin, aula, cupos, cupos_disponibles, publicado)
SELECT c.id, 'enero', 2027, v.seccion, DATE '2027-01-11', DATE '2027-02-20',
       v.turno, v.dias, v.hora_inicio::time, v.hora_fin::time, 'Virtual', 30, 30, true
FROM (VALUES
  ('XP-W365', 'PEAD a', 'Mañana', 'Lunes, miércoles y viernes', '08:00', '12:00'),
  ('XP-W365', 'PEAD b', 'Noche', 'Lunes, miércoles y viernes', '19:00', '23:00'),
  ('XP-W365', 'PEAD c', 'Noche', 'Martes, jueves y sábado', '19:00', '23:00'),
  ('XP-E365', 'PEAD a', 'Mañana', 'Martes, jueves y sábado', '08:00', '12:00'),
  ('XP-E365', 'PEAD b', 'Noche', 'Lunes, miércoles y viernes', '19:00', '23:00'),
  ('XP-E365', 'PEAD c', 'Noche', 'Martes, jueves y sábado', '19:00', '23:00'),
  ('XP-CANVA', 'PEAD a', 'Mañana', 'Lunes, miércoles y viernes', '08:00', '12:00'),
  ('XP-CANVA', 'PEAD b', 'Mañana', 'Martes, jueves y sábado', '08:00', '12:00'),
  ('XP-CANVA', 'PEAD c', 'Noche', 'Lunes, miércoles y viernes', '19:00', '23:00'),
  ('XP-CANVA', 'PEAD d', 'Noche', 'Martes, jueves y sábado', '19:00', '23:00'),
  ('CERT-EXCEL', 'PEAD a', 'Mañana', 'Lunes, miércoles y viernes', '08:00', '12:00'),
  ('ESP-CAD2D', 'PEAD a', 'Mañana', 'Martes, jueves y sábado', '08:00', '12:00'),
  ('ESP-CAD3D', 'PEAD a', 'Noche', 'Lunes, miércoles y viernes', '19:00', '23:00'),
  ('COMP-02', 'PEAD a', 'Noche', 'Lunes, miércoles y viernes', '19:00', '23:00'),
  ('COMP-03', 'PEAD a', 'Noche', 'Lunes, miércoles y viernes', '19:00', '23:00'),
  ('COMP-03', 'PEAD b', 'Noche', 'Martes, jueves y sábado', '19:00', '23:00')
) AS v(code, seccion, turno, dias, hora_inicio, hora_fin)
JOIN public.tbl_cursos_cinf c ON c.code = v.code;

COMMIT;

SELECT c.name, h.seccion, h.turno, h.dias, h.hora_inicio, h.hora_fin
FROM public.tbl_horarios_cursos h
JOIN public.tbl_cursos_cinf c ON c.id = h.curso_id
WHERE h.ciclo = 'enero' AND h.anio = 2027
ORDER BY c.display_order, h.seccion;
