-- Enero 2027 tal como está en la hoja «Horarios enero 2027»:
--   1) Computación II y III terminan a las 10:30 p. m.
--   2) Se agregan los 4 grupos de Computación II por especialidad.
-- No borra nada. Es una transacción: si algo falla, no cambia nada.
BEGIN;

UPDATE public.tbl_horarios_cursos h
SET hora_fin = TIME '22:30', updated_at = now()
FROM public.tbl_cursos_cinf c
WHERE c.id = h.curso_id AND c.code IN ('COMP-02', 'COMP-03')
  AND h.ciclo = 'enero' AND h.anio = 2027;

INSERT INTO public.tbl_horarios_cursos
  (curso_id, ciclo, anio, seccion, fecha_inicio, fecha_fin, turno, dias, hora_inicio, hora_fin, aula, cupos, cupos_disponibles, publicado)
SELECT c.id, 'enero', 2027, v.seccion, DATE '2027-01-11', DATE '2027-02-20',
       'Noche', v.dias, TIME '19:00', TIME '22:30', 'Virtual', 30, 30, true
FROM (VALUES
  ('PEAD CIV',  'Lunes, miércoles y viernes'),
  ('PEAD SIST', 'Lunes, miércoles y viernes'),
  ('PEAD MEC',  'Martes, jueves y sábado'),
  ('PEAD ARQ',  'Martes, jueves y sábado')
) AS v(seccion, dias)
JOIN public.tbl_cursos_cinf c ON c.code = 'COMP-02'
ON CONFLICT (curso_id, ciclo, anio, seccion) DO NOTHING;

COMMIT;

-- Comprobación: 20 filas en enero 2027 (16 + 4)
SELECT c.name, h.seccion, h.dias, h.hora_inicio, h.hora_fin
FROM public.tbl_horarios_cursos h
JOIN public.tbl_cursos_cinf c ON c.id = h.curso_id
WHERE h.ciclo = 'enero' AND h.anio = 2027
ORDER BY c.display_order, h.seccion;
